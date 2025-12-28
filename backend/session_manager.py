from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone, timedelta
import os
from typing import Optional, Dict
import httpx

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

class SessionManager:
    @staticmethod
    async def exchange_session_id(session_id: str) -> Dict:
        """
        Exchange session_id for user data from Emergent Auth
        """
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
                headers={"X-Session-ID": session_id},
                timeout=10.0
            )
            response.raise_for_status()
            return response.json()
    
    @staticmethod
    async def create_session(user_id: str, session_token: str) -> Dict:
        """
        Create a new session in the database
        """
        session_data = {
            "user_id": user_id,
            "session_token": session_token,
            "expires_at": datetime.now(timezone.utc) + timedelta(days=7),
            "created_at": datetime.now(timezone.utc)
        }
        await db.user_sessions.insert_one(session_data)
        return session_data
    
    @staticmethod
    async def get_session(session_token: str) -> Optional[Dict]:
        """
        Get session from database and validate expiry
        """
        session = await db.user_sessions.find_one(
            {"session_token": session_token},
            {"_id": 0}
        )
        
        if not session:
            return None
        
        # Validate expiry
        expires_at = session["expires_at"]
        if isinstance(expires_at, str):
            expires_at = datetime.fromisoformat(expires_at)
        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)
        
        if expires_at < datetime.now(timezone.utc):
            # Delete expired session
            await db.user_sessions.delete_one({"session_token": session_token})
            return None
        
        return session
    
    @staticmethod
    async def delete_session(session_token: str):
        """
        Delete a session (logout)
        """
        await db.user_sessions.delete_one({"session_token": session_token})
    
    @staticmethod
    async def get_or_create_user(user_data: Dict) -> Dict:
        """
        Get existing user by email or create new one
        """
        existing_user = await db.users.find_one(
            {"email": user_data["email"]},
            {"_id": 0}
        )
        
        if existing_user:
            # Update user data if needed
            await db.users.update_one(
                {"email": user_data["email"]},
                {"$set": {
                    "name": user_data["name"],
                    "profile_picture": user_data.get("picture", "")
                }}
            )
            return existing_user
        
        # Create new user
        new_user = {
            "id": user_data["id"],
            "email": user_data["email"],
            "name": user_data["name"],
            "profile_picture": user_data.get("picture", ""),
            "password_hash": "",  # No password for Google auth users
            "is_host": True,  # Everyone can create events
            "created_at": datetime.now(timezone.utc)
        }
        
        await db.users.insert_one(new_user)
        return await db.users.find_one({"id": new_user["id"]}, {"_id": 0})
