from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request, Header
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
from passlib.context import CryptContext
import jwt
from emergentintegrations.payments.stripe.checkout import StripeCheckout, CheckoutSessionResponse, CheckoutStatusResponse, CheckoutSessionRequest

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Security
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
JWT_SECRET = os.environ.get('JWT_SECRET', 'satsang_secret_key_change_in_production')
JWT_ALGORITHM = os.environ.get('JWT_ALGORITHM', 'HS256')

# Stripe setup
STRIPE_API_KEY = os.environ.get('STRIPE_API_KEY')

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# ============ MODELS ============

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    name: str
    password_hash: str = ""
    phone: Optional[str] = None
    bio: Optional[str] = None
    profile_picture: Optional[str] = None
    is_host: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserCreate(BaseModel):
    email: EmailStr
    name: str
    password: str
    phone: Optional[str] = None
    is_host: bool = False

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    phone: Optional[str] = None
    bio: Optional[str] = None
    profile_picture: Optional[str] = None
    is_host: bool
    created_at: datetime

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class Event(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    host_id: str
    title: str
    description: str
    category: str
    event_type: str  # in-person, online, hybrid
    location: Optional[str] = None
    meeting_link: Optional[str] = None
    start_date: datetime
    end_date: datetime
    capacity: int
    cover_image: Optional[str] = None
    price: float = 0.0  # 0 for free events
    status: str = "published"  # draft, published, cancelled
    tags: List[str] = []
    requirements: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class EventCreate(BaseModel):
    title: str
    description: str
    category: str
    event_type: str
    location: Optional[str] = None
    meeting_link: Optional[str] = None
    start_date: datetime
    end_date: datetime
    capacity: int
    cover_image: Optional[str] = None
    price: float = 0.0
    status: str = "published"
    tags: List[str] = []
    requirements: Optional[str] = None

class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    event_type: Optional[str] = None
    location: Optional[str] = None
    meeting_link: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    capacity: Optional[int] = None
    cover_image: Optional[str] = None
    price: Optional[float] = None
    status: Optional[str] = None
    tags: Optional[List[str]] = None
    requirements: Optional[str] = None

class EventResponse(BaseModel):
    id: str
    host_id: str
    host_name: Optional[str] = None
    title: str
    description: str
    category: str
    event_type: str
    location: Optional[str] = None
    meeting_link: Optional[str] = None
    start_date: datetime
    end_date: datetime
    capacity: int
    cover_image: Optional[str] = None
    price: float
    status: str
    tags: List[str]
    requirements: Optional[str] = None
    registered_count: int = 0
    created_at: datetime
    updated_at: datetime

class Registration(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    event_id: str
    user_id: str
    user_email: str
    user_name: str
    registration_date: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    status: str = "confirmed"  # confirmed, waitlist, cancelled
    payment_status: str = "pending"  # pending, paid, failed
    payment_session_id: Optional[str] = None
    qr_code: Optional[str] = None

class RegistrationCreate(BaseModel):
    event_id: str

class RegistrationResponse(BaseModel):
    id: str
    event_id: str
    event_title: Optional[str] = None
    event_start_date: Optional[datetime] = None
    event_cover_image: Optional[str] = None
    user_id: str
    user_email: str
    user_name: str
    registration_date: datetime
    status: str
    payment_status: str
    qr_code: Optional[str] = None

class PaymentTransaction(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    user_id: Optional[str] = None
    user_email: Optional[str] = None
    event_id: str
    amount: float
    currency: str = "usd"
    payment_status: str = "initiated"  # initiated, paid, failed, expired
    status: str = "pending"  # pending, completed, failed
    metadata: Dict[str, Any] = {}
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CheckoutRequest(BaseModel):
    event_id: str
    origin_url: str

# ============ AUTH UTILITIES ============

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=30)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(authorization: Optional[str] = Header(None)) -> Optional[User]:
    if not authorization:
        return None
    try:
        token = authorization.replace("Bearer ", "")
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            return None
        user_doc = await db.users.find_one({"id": user_id}, {"_id": 0})
        if not user_doc:
            return None
        return User(**user_doc)
    except:
        return None

async def require_auth(authorization: Optional[str] = Header(None)) -> User:
    user = await get_current_user(authorization)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user

# ============ AUTH ENDPOINTS ============

@api_router.post("/auth/signup", response_model=TokenResponse)
async def signup(user_data: UserCreate):
    # Check if user exists
    existing = await db.users.find_one({"email": user_data.email}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    user = User(
        email=user_data.email,
        name=user_data.name,
        password_hash=hash_password(user_data.password),
        phone=user_data.phone,
        is_host=user_data.is_host
    )
    
    user_dict = user.model_dump()
    user_dict['created_at'] = user_dict['created_at'].isoformat()
    await db.users.insert_one(user_dict)
    
    # Create token
    token = create_access_token({"sub": user.id, "email": user.email})
    
    user_response = UserResponse(
        id=user.id,
        email=user.email,
        name=user.name,
        phone=user.phone,
        bio=user.bio,
        profile_picture=user.profile_picture,
        is_host=user.is_host,
        created_at=user.created_at
    )
    
    return TokenResponse(access_token=token, user=user_response)

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    user_doc = await db.users.find_one({"email": credentials.email}, {"_id": 0})
    if not user_doc:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    user = User(**user_doc)
    if not verify_password(credentials.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    token = create_access_token({"sub": user.id, "email": user.email})
    
    user_response = UserResponse(
        id=user.id,
        email=user.email,
        name=user.name,
        phone=user.phone,
        bio=user.bio,
        profile_picture=user.profile_picture,
        is_host=user.is_host,
        created_at=user.created_at
    )
    
    return TokenResponse(access_token=token, user=user_response)

@api_router.get("/auth/me", response_model=UserResponse)
async def get_me(user: User = Depends(require_auth)):
    return UserResponse(
        id=user.id,
        email=user.email,
        name=user.name,
        phone=user.phone,
        bio=user.bio,
        profile_picture=user.profile_picture,
        is_host=user.is_host,
        created_at=user.created_at
    )

# ============ GOOGLE AUTH ENDPOINTS ============
from session_manager import SessionManager
from visitor_counter import VisitorCounter

class GoogleCallbackRequest(BaseModel):
    session_id: str

@api_router.post("/auth/google/callback")
async def google_callback(request: GoogleCallbackRequest):
    """
    Exchange session_id for user data and create/update user
    """
    try:
        # Get user data from Emergent Auth
        user_data = await SessionManager.exchange_session_id(request.session_id)
        
        # Get or create user in our database
        user = await SessionManager.get_or_create_user(user_data)
        
        # Create session with the session_token from Emergent
        session_token = user_data["session_token"]
        await SessionManager.create_session(user["id"], session_token)
        
        # Create our own JWT token for consistency with email/password login
        access_token = create_access_token({"sub": user["id"], "email": user["email"]})
        
        # Return user data and access token (same format as regular login)
        user_response = UserResponse(
            id=user["id"],
            email=user["email"],
            name=user["name"],
            phone=user.get("phone"),
            bio=user.get("bio"),
            profile_picture=user.get("profile_picture", ""),
            is_host=user.get("is_host", True),
            created_at=user["created_at"]
        )
        
        return {
            "user": user_response,
            "access_token": access_token  # Changed from session_token to access_token
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Authentication failed: {str(e)}")

# ============ EVENT ENDPOINTS ============

@api_router.post("/events", response_model=EventResponse)
async def create_event(event_data: EventCreate, user: User = Depends(require_auth)):
    # Any authenticated user can create events
    
    # Validate start_date < end_date
    if event_data.start_date >= event_data.end_date:
        raise HTTPException(
            status_code=400, 
            detail="Start date must be before end date"
        )
    
    event = Event(
        host_id=user.id,
        **event_data.model_dump()
    )
    
    event_dict = event.model_dump()
    event_dict['start_date'] = event_dict['start_date'].isoformat()
    event_dict['end_date'] = event_dict['end_date'].isoformat()
    event_dict['created_at'] = event_dict['created_at'].isoformat()
    event_dict['updated_at'] = event_dict['updated_at'].isoformat()
    
    await db.events.insert_one(event_dict)
    
    return EventResponse(
        **event.model_dump(),
        host_name=user.name,
        registered_count=0
    )

@api_router.get("/events", response_model=List[EventResponse])
async def get_events(
    search: Optional[str] = None,
    category: Optional[str] = None,
    event_type: Optional[str] = None,
    status: Optional[str] = "published",
    featured: Optional[bool] = None
):
    query = {}
    if status:
        query["status"] = status
    if category:
        query["category"] = category
    if event_type:
        query["event_type"] = event_type
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}}
        ]
    
    events = await db.events.find(query, {"_id": 0}).sort("start_date", 1).to_list(100)
    
    # Get registration counts
    result = []
    for event in events:
        if isinstance(event['start_date'], str):
            event['start_date'] = datetime.fromisoformat(event['start_date'])
        if isinstance(event['end_date'], str):
            event['end_date'] = datetime.fromisoformat(event['end_date'])
        if isinstance(event['created_at'], str):
            event['created_at'] = datetime.fromisoformat(event['created_at'])
        if isinstance(event['updated_at'], str):
            event['updated_at'] = datetime.fromisoformat(event['updated_at'])
        
        reg_count = await db.registrations.count_documents({"event_id": event['id'], "status": "confirmed"})
        
        # Get host name
        host = await db.users.find_one({"id": event['host_id']}, {"_id": 0, "name": 1})
        
        result.append(EventResponse(
            **event,
            host_name=host.get('name') if host else None,
            registered_count=reg_count
        ))
    
    return result

@api_router.get("/events/{event_id}", response_model=EventResponse)
async def get_event(event_id: str):
    event = await db.events.find_one({"id": event_id}, {"_id": 0})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    if isinstance(event['start_date'], str):
        event['start_date'] = datetime.fromisoformat(event['start_date'])
    if isinstance(event['end_date'], str):
        event['end_date'] = datetime.fromisoformat(event['end_date'])
    if isinstance(event['created_at'], str):
        event['created_at'] = datetime.fromisoformat(event['created_at'])
    if isinstance(event['updated_at'], str):
        event['updated_at'] = datetime.fromisoformat(event['updated_at'])
    
    reg_count = await db.registrations.count_documents({"event_id": event_id, "status": "confirmed"})
    
    host = await db.users.find_one({"id": event['host_id']}, {"_id": 0, "name": 1})
    
    return EventResponse(
        **event,
        host_name=host.get('name') if host else None,
        registered_count=reg_count
    )

@api_router.put("/events/{event_id}", response_model=EventResponse)
async def update_event(event_id: str, update_data: EventUpdate, user: User = Depends(require_auth)):
    event = await db.events.find_one({"id": event_id}, {"_id": 0})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    if event['host_id'] != user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this event")
    
    update_dict = {k: v for k, v in update_data.model_dump(exclude_unset=True).items() if v is not None}
    
    # Validate start_date < end_date if both are being updated or exist
    if 'start_date' in update_dict or 'end_date' in update_dict:
        start_date = update_dict.get('start_date')
        end_date = update_dict.get('end_date')
        
        # Get current dates if not in update
        if not start_date:
            start_date = event['start_date'] if isinstance(event['start_date'], datetime) else datetime.fromisoformat(event['start_date'])
        if not end_date:
            end_date = event['end_date'] if isinstance(event['end_date'], datetime) else datetime.fromisoformat(event['end_date'])
        
        if start_date >= end_date:
            raise HTTPException(status_code=400, detail="Start date must be before end date")
    
    if update_dict:
        update_dict['updated_at'] = datetime.now(timezone.utc).isoformat()
        
        # Convert datetime objects to ISO strings
        for key in ['start_date', 'end_date']:
            if key in update_dict and isinstance(update_dict[key], datetime):
                update_dict[key] = update_dict[key].isoformat()
        
        await db.events.update_one({"id": event_id}, {"$set": update_dict})
    
    updated_event = await db.events.find_one({"id": event_id}, {"_id": 0})
    
    if isinstance(updated_event['start_date'], str):
        updated_event['start_date'] = datetime.fromisoformat(updated_event['start_date'])
    if isinstance(updated_event['end_date'], str):
        updated_event['end_date'] = datetime.fromisoformat(updated_event['end_date'])
    if isinstance(updated_event['created_at'], str):
        updated_event['created_at'] = datetime.fromisoformat(updated_event['created_at'])
    if isinstance(updated_event['updated_at'], str):
        updated_event['updated_at'] = datetime.fromisoformat(updated_event['updated_at'])
    
    reg_count = await db.registrations.count_documents({"event_id": event_id, "status": "confirmed"})
    
    return EventResponse(**updated_event, host_name=user.name, registered_count=reg_count)

@api_router.delete("/events/{event_id}")
async def delete_event(event_id: str, user: User = Depends(require_auth)):
    event = await db.events.find_one({"id": event_id}, {"_id": 0})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    if event['host_id'] != user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this event")
    
    await db.events.delete_one({"id": event_id})
    return {"message": "Event deleted successfully"}

@api_router.post("/admin/clear-all-events")
async def clear_all_events():
    """Admin endpoint to delete all events, registrations, and transactions"""
    try:
        events_result = await db.events.delete_many({})
        reg_result = await db.registrations.delete_many({})
        payment_result = await db.payment_transactions.delete_many({})
        
        return {
            "message": "Database cleared successfully",
            "events_deleted": events_result.deleted_count,
            "registrations_deleted": reg_result.deleted_count,
            "payments_deleted": payment_result.deleted_count
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to clear database: {str(e)}")

@api_router.get("/events/host/my-events", response_model=List[EventResponse])
async def get_my_events(user: User = Depends(require_auth)):
    # Any authenticated user can access their created events
    events = await db.events.find({"host_id": user.id}, {"_id": 0}).sort("start_date", -1).to_list(100)
    
    result = []
    for event in events:
        if isinstance(event['start_date'], str):
            event['start_date'] = datetime.fromisoformat(event['start_date'])
        if isinstance(event['end_date'], str):
            event['end_date'] = datetime.fromisoformat(event['end_date'])
        if isinstance(event['created_at'], str):
            event['created_at'] = datetime.fromisoformat(event['created_at'])
        if isinstance(event['updated_at'], str):
            event['updated_at'] = datetime.fromisoformat(event['updated_at'])
        
        reg_count = await db.registrations.count_documents({"event_id": event['id'], "status": "confirmed"})
        result.append(EventResponse(**event, host_name=user.name, registered_count=reg_count))
    
    return result

# ============ REGISTRATION ENDPOINTS ============

@api_router.post("/registrations", response_model=RegistrationResponse)
async def create_registration(reg_data: RegistrationCreate, user: User = Depends(require_auth)):
    # Check if event exists
    event = await db.events.find_one({"id": reg_data.event_id}, {"_id": 0})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    # Check if already registered
    existing = await db.registrations.find_one({
        "event_id": reg_data.event_id,
        "user_id": user.id,
        "status": {"$in": ["confirmed", "waitlist"]}
    })
    if existing:
        raise HTTPException(status_code=400, detail="Already registered for this event")
    
    # Check capacity
    reg_count = await db.registrations.count_documents({"event_id": reg_data.event_id, "status": "confirmed"})
    status = "confirmed" if reg_count < event['capacity'] else "waitlist"
    
    # For paid events, payment status should be pending until payment is completed
    payment_status = "pending" if event['price'] > 0 else "paid"
    
    registration = Registration(
        event_id=reg_data.event_id,
        user_id=user.id,
        user_email=user.email,
        user_name=user.name,
        status=status,
        payment_status=payment_status,
        qr_code=f"QR-{uuid.uuid4()}"
    )
    
    reg_dict = registration.model_dump()
    reg_dict['registration_date'] = reg_dict['registration_date'].isoformat()
    
    await db.registrations.insert_one(reg_dict)
    
    if isinstance(event['start_date'], str):
        event['start_date'] = datetime.fromisoformat(event['start_date'])
    
    return RegistrationResponse(
        **registration.model_dump(),
        event_title=event['title'],
        event_start_date=event['start_date'],
        event_cover_image=event.get('cover_image')
    )

@api_router.get("/registrations/my-registrations", response_model=List[RegistrationResponse])
async def get_my_registrations(user: User = Depends(require_auth)):
    registrations = await db.registrations.find({"user_id": user.id}, {"_id": 0}).sort("registration_date", -1).to_list(100)
    
    result = []
    for reg in registrations:
        if isinstance(reg['registration_date'], str):
            reg['registration_date'] = datetime.fromisoformat(reg['registration_date'])
        
        event = await db.events.find_one({"id": reg['event_id']}, {"_id": 0})
        if event:
            if isinstance(event['start_date'], str):
                event['start_date'] = datetime.fromisoformat(event['start_date'])
            
            result.append(RegistrationResponse(
                **reg,
                event_title=event['title'],
                event_start_date=event['start_date'],
                event_cover_image=event.get('cover_image')
            ))
    
    return result

@api_router.get("/registrations/event/{event_id}", response_model=List[RegistrationResponse])
async def get_event_registrations(event_id: str, user: User = Depends(require_auth)):
    # Check if user is the host
    event = await db.events.find_one({"id": event_id}, {"_id": 0})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    if event['host_id'] != user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view registrations")
    
    registrations = await db.registrations.find({"event_id": event_id}, {"_id": 0}).to_list(1000)
    
    result = []
    for reg in registrations:
        if isinstance(reg['registration_date'], str):
            reg['registration_date'] = datetime.fromisoformat(reg['registration_date'])
        
        if isinstance(event['start_date'], str):
            event['start_date'] = datetime.fromisoformat(event['start_date'])
        
        result.append(RegistrationResponse(
            **reg,
            event_title=event['title'],
            event_start_date=event['start_date'],
            event_cover_image=event.get('cover_image')
        ))
    
    return result

# ============ PAYMENT ENDPOINTS ============

@api_router.post("/payments/checkout")
async def create_checkout_session(checkout_req: CheckoutRequest, user: User = Depends(require_auth)):
    # Get event
    event = await db.events.find_one({"id": checkout_req.event_id}, {"_id": 0})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    if event['price'] <= 0:
        raise HTTPException(status_code=400, detail="This is a free event")
    
    # Create success and cancel URLs
    success_url = f"{checkout_req.origin_url}/payment/success?session_id={{{{CHECKOUT_SESSION_ID}}}}"
    cancel_url = f"{checkout_req.origin_url}/events/{checkout_req.event_id}"
    
    # Initialize Stripe checkout
    webhook_url = f"{checkout_req.origin_url}/api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
    
    # Create checkout session
    checkout_request = CheckoutSessionRequest(
        amount=event['price'],
        currency="usd",
        success_url=success_url,
        cancel_url=cancel_url,
        metadata={
            "event_id": checkout_req.event_id,
            "user_id": user.id,
            "user_email": user.email
        }
    )
    
    session = await stripe_checkout.create_checkout_session(checkout_request)
    
    # Create payment transaction record
    transaction = PaymentTransaction(
        session_id=session.session_id,
        user_id=user.id,
        user_email=user.email,
        event_id=checkout_req.event_id,
        amount=event['price'],
        currency="usd",
        payment_status="initiated",
        status="pending",
        metadata={
            "event_title": event['title'],
            "user_name": user.name
        }
    )
    
    trans_dict = transaction.model_dump()
    trans_dict['created_at'] = trans_dict['created_at'].isoformat()
    trans_dict['updated_at'] = trans_dict['updated_at'].isoformat()
    
    await db.payment_transactions.insert_one(trans_dict)
    
    return {"url": session.url, "session_id": session.session_id}

@api_router.get("/payments/status/{session_id}")
async def get_payment_status(session_id: str, user: User = Depends(require_auth)):
    # Check if transaction exists and belongs to user
    transaction = await db.payment_transactions.find_one({"session_id": session_id, "user_id": user.id}, {"_id": 0})
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    # If already processed, return current status
    if transaction['payment_status'] in ['paid', 'failed', 'expired']:
        return {
            "status": transaction['status'],
            "payment_status": transaction['payment_status'],
            "amount": transaction['amount'],
            "currency": transaction['currency']
        }
    
    # Initialize Stripe checkout
    webhook_url = f"{os.environ.get('REACT_APP_BACKEND_URL', 'http://localhost:8001')}/api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
    
    # Get status from Stripe
    status_response = await stripe_checkout.get_checkout_status(session_id)
    
    # Update transaction
    update_data = {
        "payment_status": status_response.payment_status,
        "status": "completed" if status_response.payment_status == "paid" else transaction['status'],
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.payment_transactions.update_one({"session_id": session_id}, {"$set": update_data})
    
    # If payment is successful, update registration
    if status_response.payment_status == "paid" and transaction['payment_status'] != "paid":
        await db.registrations.update_one(
            {"event_id": transaction['event_id'], "user_id": user.id},
            {"$set": {"payment_status": "paid", "payment_session_id": session_id}}
        )
    
    return {
        "status": update_data['status'],
        "payment_status": status_response.payment_status,
        "amount": status_response.amount_total / 100.0,  # Convert cents to dollars
        "currency": status_response.currency
    }

@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    body = await request.body()
    signature = request.headers.get("Stripe-Signature")
    
    webhook_url = f"{os.environ.get('REACT_APP_BACKEND_URL', 'http://localhost:8001')}/api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
    
    try:
        webhook_response = await stripe_checkout.handle_webhook(body, signature)
        
        # Update transaction
        if webhook_response.event_type == "checkout.session.completed":
            await db.payment_transactions.update_one(
                {"session_id": webhook_response.session_id},
                {"$set": {
                    "payment_status": webhook_response.payment_status,
                    "status": "completed",
                    "updated_at": datetime.now(timezone.utc).isoformat()
                }}
            )
            
            # Update registration
            transaction = await db.payment_transactions.find_one({"session_id": webhook_response.session_id}, {"_id": 0})
            if transaction:
                await db.registrations.update_one(
                    {"event_id": transaction['event_id'], "user_id": transaction['user_id']},
                    {"$set": {"payment_status": "paid", "payment_session_id": webhook_response.session_id}}
                )
        
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ============ ROOT ENDPOINT ============

@api_router.get("/")
async def root():
    return {"message": "Satsang Event Platform API"}

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
