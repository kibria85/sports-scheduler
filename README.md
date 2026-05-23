# Sports Scheduler Application

A comprehensive web application for managing sports events, player registrations, teams, and payments.

## Features

### Core Features
- Player profiles with complete information (name, address, contact, emergency contacts, etc.)
- Multiple user roles: Super Admin, Admin, Manager, Player, Sponsor, Volunteer
- Sport management and configuration
- Event creation and management
- Team management
- Player registration for events
- Payment processing and tracking
- Unified calendar view
- Anonymous sponsor payments

### Sport Configuration
- Super Admins can create, edit, and manage sports
- Each sport has custom URL slug (/cricket, /badminton, /soccer)
- Sports have assigned admins
- Dashboard showing upcoming events

### Event Management
- Admin can create events with custom dates
- Add teams with roles (Manager, Playing Manager, Player, Student, Sponsor)
- Role-based fee structure
- Assign players to teams
- Manage sponsors

### Player Registration
- Register for multiple events
- Fill jersey information (name, number, size)
- Skill level description
- Date availability selection
- Payment of registration fees

### Payment System
- Player payment notifications (SMS & Email)
- In-app payment processing via Stripe
- Anonymous sponsor payments
- Payment status tracking

### Calendar
- Unified calendar view by year
- Mark event dates
- View scheduled events

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Payments**: Stripe
- **File Upload**: Multer
- **Notifications**: Nodemailer, Twilio

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Payments**: Stripe.js
- **Styling**: CSS3

## Project Structure

```
sports-scheduler/
├── packages/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── config/          # Database and configuration
│   │   │   ├── middleware/      # Auth and error handling
│   │   │   ├── services/        # Business logic
│   │   │   ├── routes/          # API endpoints
│   │   │   ├── types/           # TypeScript types
│   │   │   ├── utils/           # Helper functions
│   │   │   └── index.ts         # Entry point
│   │   └── package.json
│   └── frontend/
│       ├── src/
│       │   ├── api/             # API client
│       │   ├── pages/           # Page components
│       │   ├── components/      # Reusable components
│       │   ├── App.tsx          # Root component
│       │   ├── App.css          # Styles
│       │   └── index.tsx        # Entry point
│       ├── public/
│       └── package.json
└── package.json
```

## Installation

### Prerequisites
- Node.js 16+ and npm/yarn
- PostgreSQL 12+
- Stripe account (for payment processing)

### Backend Setup

1. Install dependencies:
```bash
cd packages/backend
npm install
```

2. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Configure environment variables in `.env`:
```
DATABASE_URL=postgresql://user:password@localhost:5432/sports_scheduler
JWT_SECRET=your-secret-key
STRIPE_SECRET_KEY=sk_test_xxx
```

4. Initialize database:
```bash
npm run migrate
```

5. Start backend server:
```bash
npm run dev
```

Backend runs on http://localhost:5000

### Frontend Setup

1. Install dependencies:
```bash
cd packages/frontend
npm install
```

2. Create `.env` file:
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STRIPE_KEY=pk_test_xxx
```

3. Start frontend development server:
```bash
npm run dev
```

Frontend runs on http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Sports
- `GET /api/sports` - Get all sports
- `GET /api/sports/:slug` - Get sport by slug
- `POST /api/sports` - Create sport (Super Admin)
- `PUT /api/sports/:id` - Update sport (Super Admin)
- `DELETE /api/sports/:id` - Delete sport (Super Admin)
- `GET /api/sports/:sportId/events` - Get upcoming events

### Events
- `POST /api/events` - Create event (Admin)
- `GET /api/events/:id` - Get event details
- `POST /api/events/:eventId/teams` - Create team (Admin)
- `GET /api/events/:eventId/teams` - Get teams
- `POST /api/events/:eventId/register` - Register player
- `GET /api/events/:eventId/registration` - Get player registration
- `POST /api/events/:eventId/assign-player` - Assign player to team (Admin)

### Payments
- `GET /api/payments/user/pending` - Get pending payments
- `POST /api/payments/intent` - Create payment intent
- `POST /api/payments/complete` - Complete payment
- `POST /api/payments/sponsor` - Add sponsor
- `GET /api/payments/event/:eventId/sponsors` - Get event sponsors

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `GET /api/users` - Get all users (Super Admin)

## Database Schema

### Tables
- **users** - User profiles and authentication
- **sports** - Sports configuration
- **sport_events** - Events under sports
- **teams** - Teams within events
- **event_roles** - Roles and fees for events
- **player_registrations** - Player event registrations
- **sponsors** - Sponsors for events
- **payments** - Payment records
- **sport_admins** - Admin assignments to sports

## Features Implementation Roadmap

- [x] User authentication and profiles
- [x] Sport management
- [x] Event creation and management
- [x] Team management
- [x] Player registration
- [x] Payment system
- [x] Basic UI
- [ ] Email notifications
- [ ] SMS notifications
- [ ] File uploads for photos
- [ ] Calendar widget
- [ ] Admin dashboard
- [ ] Player dashboard
- [ ] Team roster management
- [ ] Match scheduling
- [ ] Score tracking
- [ ] Analytics and reporting

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (RBAC)
- SQL injection prevention with parameterized queries
- CORS protection
- Secure payment processing with Stripe

## Running in Production

1. Build backend:
```bash
cd packages/backend
npm run build
npm start
```

2. Build frontend:
```bash
cd packages/frontend
npm run build
```

3. Deploy built files to hosting service

## Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Create pull request

## License

MIT
