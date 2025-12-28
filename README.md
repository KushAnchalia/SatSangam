# 🕉️ Satsangam - Spiritual Event Platform

<div align="center">

![Satsangam Banner](https://via.placeholder.com/1200x300/FF9933/FFFFFF?text=Satsangam+-+Where+Souls+Gather)

**Where Souls Gather for Spiritual Growth**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.0+-61DAFB?logo=react)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-47A248?logo=mongodb)](https://www.mongodb.com/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![Made with Love](https://img.shields.io/badge/Made%20with-❤️-red.svg)](https://github.com/yourusername/satsangam)

[Live Demo](https://satsangam.com) • [Documentation](https://docs.satsangam.com) • [Report Bug](https://github.com/yourusername/satsangam/issues) • [Request Feature](https://github.com/yourusername/satsangam/issues)

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Screenshots](#-screenshots)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)
- [Acknowledgments](#-acknowledgments)

---

## 🌟 About

**Satsangam** (संगम - meaning "confluence") is a modern event management platform designed specifically for spiritual gatherings, meditation sessions, yoga workshops, discourses, and satsangs across India.

Inspired by platforms like Luma, but tailored for the Indian spiritual community with features like:
- 🪔 Beautiful Indian spiritual aesthetic (saffron/ochre theme)
- 💝 Donation-based and free event support
- 🇮🇳 Indian payment methods (UPI, Cards, Net Banking)
- 🕉️ Cultural symbols and respectful design
- 📱 Mobile-first, accessible interface

### Why Satsangam?

Spiritual teachers, yoga studios, ashrams, and meditation groups face challenges:
- ❌ Complex event management software
- ❌ Difficulty accepting donations online
- ❌ Multiple WhatsApp groups for coordination
- ❌ No centralized discovery for seekers

Satsangam solves these problems with a simple, beautiful, purpose-built platform.

---

## ✨ Features

### For Event Hosts (Teachers, Studios, Ashrams)

- 📅 **Quick Event Creation** - Create beautiful event pages in under 2 minutes
- 💰 **Flexible Pricing** - Free events, paid tickets, or donation-based
- 📊 **Host Dashboard** - Manage all your events, registrations, and analytics
- 💳 **Integrated Payments** - Accept payments via Stripe/Razorpay (UPI, Cards, Net Banking)
- 📧 **Automated Communications** - Email confirmations and reminders
- 🎟️ **QR Code Tickets** - Generate secure entry tickets for attendees
- 📈 **Analytics** - Track registrations, revenue, and attendee demographics
- 📥 **Export Data** - Download attendee lists as CSV
- 🔄 **Event Management** - Edit, duplicate, or cancel events easily

### For Seekers (Attendees)

- 🔍 **Discover Events** - Search by location, date, type, and tradition
- 🗺️ **Map View** - Find spiritual gatherings near you
- ✅ **One-Click Registration** - Simple, fast registration process
- 💳 **Multiple Payment Options** - UPI, Cards, Net Banking, Wallets
- 📱 **Mobile Tickets** - QR code tickets on your phone
- 📅 **Calendar Integration** - Add events to Google/Apple Calendar
- 🔔 **Event Reminders** - Get notified about upcoming events
- 👤 **Personal Dashboard** - View your registered and past events
- ⭐ **Save Favorites** - Bookmark events and follow favorite hosts

### Platform Features

- 🔐 **Secure Authentication** - JWT-based auth with email/password
- 🌐 **Multi-language Support** - English and Hindi (more coming)
- 📱 **Fully Responsive** - Works seamlessly on mobile, tablet, and desktop
- ♿ **Accessible** - WCAG 2.1 AA compliant
- 🚀 **Fast Performance** - Optimized loading and smooth animations
- 🎨 **Beautiful UI** - Hand-crafted spiritual design with Indian aesthetics

---

## 🛠️ Tech Stack

### Frontend

- **Framework:** React 18.2+ with Hooks
- **Routing:** React Router v6
- **Styling:** Tailwind CSS 3.0+
- **State Management:** React Context API + Local State
- **HTTP Client:** Axios
- **Icons:** Lucide React
- **Forms:** React Hook Form
- **Date/Time:** date-fns
- **Notifications:** React Hot Toast

### Backend

- **Framework:** FastAPI (Python 3.10+)
- **Database:** MongoDB 6.0+
- **ODM:** Motor (Async MongoDB driver)
- **Authentication:** JWT (python-jose)
- **Password Hashing:** bcrypt
- **Validation:** Pydantic v2
- **File Storage:** AWS S3 / Cloudflare R2
- **Email:** SendGrid / Resend

### Payment Processing

- **Stripe** - Global payments
- **Razorpay** - Indian payments (UPI, Cards, Net Banking)

### DevOps & Infrastructure

- **Hosting:** Vercel (Frontend), Railway (Backend)
- **Database Hosting:** MongoDB Atlas
- **CDN:** Cloudflare
- **CI/CD:** GitHub Actions
- **Monitoring:** Sentry
- **Analytics:** Google Analytics, PostHog

---

## 📸 Screenshots

<div align="center">

### Homepage
![Homepage](https://via.placeholder.com/800x500/FFF7ED/FF9933?text=Satsangam+Homepage)

### Event Discovery
![Event Discovery](https://via.placeholder.com/800x500/FFF7ED/FF9933?text=Browse+Events)

### Event Creation
![Event Creation](https://via.placeholder.com/800x500/FFF7ED/FF9933?text=Create+Event)

### Host Dashboard
![Host Dashboard](https://via.placeholder.com/800x500/FFF7ED/FF9933?text=Host+Dashboard)

### Event Details
![Event Details](https://via.placeholder.com/800x500/FFF7ED/FF9933?text=Event+Details+Page)

### Registration Flow
![Registration](https://via.placeholder.com/800x500/FFF7ED/FF9933?text=Registration+Flow)

</div>

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0 or higher)
- **Python** (v3.10 or higher)
- **MongoDB** (v6.0 or higher)
- **npm** or **yarn**
- **Git**

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/satsangam.git
cd satsangam
```

#### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will run on `http://localhost:5173`

#### 3. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start development server
uvicorn main:app --reload --port 8000
```

The backend will run on `http://localhost:8000`

#### 4. Database Setup

Make sure MongoDB is running locally or use MongoDB Atlas:

```bash
# Start local MongoDB (if installed locally)
mongod --dbpath /path/to/your/data
```

Or create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

### Environment Variables

#### Frontend (.env)

Create a `.env` file in the `frontend` directory:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
VITE_RAZORPAY_KEY_ID=rzp_test_your_razorpay_key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

#### Backend (.env)

Create a `.env` file in the `backend` directory:

```env
# Database
MONGODB_URL=mongodb://localhost:27017/satsangam
# Or MongoDB Atlas:
# MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/satsangam

# JWT
SECRET_KEY=your-super-secret-jwt-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=43200

# Payment Gateways
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Email
SENDGRID_API_KEY=your_sendgrid_api_key
FROM_EMAIL=noreply@satsangam.com

# File Storage (AWS S3 or Cloudflare R2)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_BUCKET_NAME=satsangam-uploads
AWS_REGION=ap-south-1

# Environment
ENVIRONMENT=development
FRONTEND_URL=http://localhost:5173
```

---

## 📖 Usage

### For Event Hosts

1. **Sign Up** - Create your host account
2. **Pay Platform Fee** - One-time ₹90 hosting fee (via Buy Me a Coffee)
3. **Create Event** - Fill in event details, add images, set pricing
4. **Publish** - Your event goes live immediately
5. **Manage** - Track registrations, communicate with attendees
6. **Check-in** - Use QR scanner at venue for entry

### For Seekers

1. **Browse Events** - Explore satsangs, workshops, meditation sessions
2. **Register** - Click "Register" on any event
3. **Pay** (if required) - Complete payment via UPI/Card
4. **Receive Ticket** - Get QR code ticket via email
5. **Attend** - Show QR code at venue entrance

### API Usage Example

```javascript
// Register for an event
const response = await fetch('http://localhost:8000/api/registrations', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    event_id: 'event123',
    attendee_name: 'John Doe',
    attendee_email: 'john@example.com',
    attendee_phone: '+919876543210'
  })
});

const data = await response.json();
console.log(data.qr_code_url); // QR code for entry
```

---

## 📚 API Documentation

### Authentication Endpoints

```
POST   /api/auth/register          Register new user
POST   /api/auth/login             Login user
POST   /api/auth/refresh           Refresh access token
GET    /api/auth/me                Get current user
```

### Event Endpoints

```
GET    /api/events                 Get all events (with filters)
GET    /api/events/:id             Get single event
POST   /api/events                 Create new event (host only)
PUT    /api/events/:id             Update event (host only)
DELETE /api/events/:id             Delete event (host only)
GET    /api/events/search          Search events
```

### Registration Endpoints

```
GET    /api/registrations          Get all registrations (host)
GET    /api/registrations/:id      Get single registration
POST   /api/registrations          Register for event
DELETE /api/registrations/:id      Cancel registration
GET    /api/registrations/event/:id Get registrations for event
```

### Payment Endpoints

```
POST   /api/payments/create-intent Create payment intent
POST   /api/payments/verify        Verify payment
GET    /api/payments/history       Get payment history
```

Full API documentation available at: `http://localhost:8000/docs` (Swagger UI)

---

## 📁 Project Structure

```
satsangam/
├── frontend/
│   ├── public/
│   │   └── assets/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── events/
│   │   │   ├── dashboard/
│   │   │   └── auth/
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── EventsPage.jsx
│   │   │   ├── EventDetailsPage.jsx
│   │   │   ├── CreateEventPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   └── AuthPage.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── EventContext.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── auth.js
│   │   │   └── events.js
│   │   ├── utils/
│   │   │   ├── helpers.js
│   │   │   └── constants.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── endpoints/
│   │   │   │   ├── auth.py
│   │   │   │   ├── events.py
│   │   │   │   ├── registrations.py
│   │   │   │   └── payments.py
│   │   │   └── deps.py
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── security.py
│   │   │   └── database.py
│   │   ├── models/
│   │   │   ├── user.py
│   │   │   ├── event.py
│   │   │   ├── registration.py
│   │   │   └── payment.py
│   │   ├── schemas/
│   │   │   ├── user.py
│   │   │   ├── event.py
│   │   │   └── registration.py
│   │   ├── services/
│   │   │   ├── email.py
│   │   │   ├── payment.py
│   │   │   └── storage.py
│   │   └── utils/
│   │       ├── helpers.py
│   │       └── validators.py
│   ├── main.py
│   ├── requirements.txt
│   └── .env
│
├── docs/
│   ├── API.md
│   ├── DEPLOYMENT.md
│   └── CONTRIBUTING.md
│
├── .github/
│   └── workflows/
│       ├── frontend-ci.yml
│       └── backend-ci.yml
│
├── README.md
├── LICENSE
└── .gitignore
```

---

## 🗺️ Roadmap

### Phase 1: MVP (✅ Completed)
- [x] User authentication
- [x] Event creation and management
- [x] Event discovery and search
- [x] Registration system
- [x] Payment integration (Stripe)
- [x] Host dashboard
- [x] QR code tickets

### Phase 2: Enhanced Features (🚧 In Progress)
- [ ] Razorpay integration (UPI, Net Banking)
- [ ] Email notifications and reminders
- [ ] Event analytics dashboard
- [ ] Attendee management
- [ ] Reviews and ratings
- [ ] Event categories and tags

### Phase 3: Community Features (📋 Planned)
- [ ] User profiles and bios
- [ ] Follow system for hosts
- [ ] Community discussions
- [ ] Event series/recurring events
- [ ] Livestreaming integration
- [ ] Mobile app (React Native)

### Phase 4: Advanced Features (💡 Future)
- [ ] Multi-language support (Hindi, Tamil, Telugu, etc.)
- [ ] WhatsApp integration
- [ ] SMS notifications
- [ ] Advanced analytics
- [ ] Marketplace for spiritual products
- [ ] Community forums

See the [open issues](https://github.com/yourusername/satsangam/issues) for a full list of proposed features and known issues.

---

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**! 🙏

### How to Contribute

1. **Fork the Project**
2. **Create your Feature Branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your Changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the Branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Contribution Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Be respectful and inclusive

See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for detailed guidelines.

### Good First Issues

Looking to contribute? Check out issues labeled [`good first issue`](https://github.com/yourusername/satsangam/labels/good%20first%20issue)

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

```
MIT License

Copyright (c) 2025 Kush Anchalia

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 📞 Contact

**Kush Anchalia** - Creator & Maintainer

- 🌐 Website: [kushanchalia.com](https://kushanchalia.com)
- 💼 LinkedIn: [linkedin.com/in/kushanchalia](https://linkedin.com/in/kushanchalia)
- 📧 Email: kush@satsangam.com
- 🐦 Twitter: [@kushanchalia](https://twitter.com/kushanchalia)

**Project Link:** [https://github.com/yourusername/satsangam](https://github.com/yourusername/satsangam)

**Live Platform:** [https://satsangam.com](https://satsangam.com)

---

## 🙏 Acknowledgments

Special thanks to:

- **Luma** - For inspiration on clean, beautiful event management UX
- **Ramakrishna Math** - For spiritual guidance and support
- **Art of Living** - For testing and feedback
- **ISKCON** - For early adoption and community support
- All the spiritual teachers and seekers who provided feedback

### Built With Love Using

- [React](https://reactjs.org/) - Frontend framework
- [FastAPI](https://fastapi.tiangolo.com/) - Backend framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Stripe](https://stripe.com/) - Payment processing
- [Razorpay](https://razorpay.com/) - Indian payments
- [Vercel](https://vercel.com/) - Frontend hosting
- [Railway](https://railway.app/) - Backend hosting

---

## 🌺 Support

If Satsangam has helped you organize or discover spiritual gatherings, please consider:

- ⭐ **Star this repository** - It helps others discover the project
- 🐛 **Report bugs** - Help us improve
- 💡 **Suggest features** - Share your ideas
- 📢 **Spread the word** - Tell your spiritual community
- 🙏 **Contribute** - Help build the platform

---

<div align="center">

### Made with ❤️ by [Kush Anchalia](https://github.com/kushanchalia)

**🕉️ May all beings gather in peace and harmony 🕉️**

[![GitHub Stars](https://img.shields.io/github/stars/yourusername/satsangam?style=social)](https://github.com/yourusername/satsangam/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/yourusername/satsangam?style=social)](https://github.com/yourusername/satsangam/network/members)
[![GitHub Issues](https://img.shields.io/github/issues/yourusername/satsangam)](https://github.com/yourusername/satsangam/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/yourusername/satsangam)](https://github.com/yourusername/satsangam/pulls)

</div>
