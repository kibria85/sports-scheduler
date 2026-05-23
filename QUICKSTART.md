# Quick Start Guide

## Option 1: Using Docker (Recommended)

### Prerequisites
- Docker & Docker Compose installed

### Steps

1. Clone/navigate to the sports-scheduler directory

2. Create `.env` file in root directory:
```bash
cp packages/backend/.env.example packages/backend/.env
cp packages/frontend/.env.example packages/frontend/.env
```

3. Update environment variables as needed (especially Stripe keys for payments)

4. Start all services:
```bash
docker-compose up
```

5. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Database: localhost:5432

6. Stop services:
```bash
docker-compose down
```

---

## Option 2: Manual Setup

### Prerequisites
- Node.js 16+
- PostgreSQL 12+
- npm or yarn

### Backend Setup

1. Navigate to backend:
```bash
cd packages/backend
```

2. Install dependencies:
```bash
npm install
```

3. Setup environment:
```bash
cp .env.example .env
```

4. Update `.env` with your database URL and credentials:
```
DATABASE_URL=postgresql://localhost/sports_scheduler
JWT_SECRET=your-secret-key
STRIPE_SECRET_KEY=sk_test_xxx
```

5. Initialize database:
```bash
npm run migrate
```

6. Seed sample data (optional):
```bash
npx ts-node src/scripts/seed.ts
```

7. Start development server:
```bash
npm run dev
```

Backend will be available at http://localhost:5000

### Frontend Setup

1. Navigate to frontend (in a new terminal):
```bash
cd packages/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Setup environment:
```bash
cp .env.example .env
```

4. Start development server:
```bash
npm run dev
```

Frontend will be available at http://localhost:3000

---

## Testing the Application

### 1. Register a New User
- Go to http://localhost:3000/register
- Fill in registration form
- Click Register

### 2. Login
- Go to http://localhost:3000/login
- Use registered email and password
- Click Login

### 3. Browse Sports
- On homepage, you'll see available sports
- Click on a sport to see upcoming events

### 4. View Event Details
- Click on an event to see full dashboard
- View teams, sponsors, and calendar

### 5. Register for Event (As Player)
- Click "Register" button on event page
- Fill in jersey information
- Choose skill level and available dates
- Make payment

### 6. Manage Events (As Admin)
- Create new events with dates
- Create teams
- Add event roles with fees
- Assign players to teams
- View registrations and sponsors

---

## Sample Test Credentials

When using seeded data, use these credentials:

**Admin User:**
- Email: admin@sports.com
- Password: password123

**Player User:**
- Email: player1@sports.com
- Password: password123

**Sponsor User:**
- Email: sponsor@sports.com
- Password: password123

---

## Useful Commands

### Backend
```bash
# Development mode
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run database migrations
npm run migrate
```

### Frontend
```bash
# Development mode
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

---

## Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env
- Verify database exists and credentials are correct

### Port Already in Use
- Backend: Change PORT in .env
- Frontend: Change PORT in .env
- Or kill existing process using the port

### API Not Responding
- Check backend is running on correct port
- Verify REACT_APP_API_URL in frontend .env
- Check CORS settings in backend

### Payment Integration Issues
- Add valid Stripe keys to .env files
- Ensure Stripe account is set up
- Check webhook configuration for Stripe

---

## Architecture Notes

- Backend uses Express.js with TypeScript
- Frontend uses React with React Router
- Database: PostgreSQL with pg driver
- Authentication: JWT tokens stored in localStorage
- Payments: Stripe integration
- File uploads: Multer (configured but not actively used in basic setup)

---

## Next Steps

1. Customize branding and colors in `App.css`
2. Add email/SMS notifications setup
3. Configure file upload for player photos
4. Setup Stripe webhook handlers
5. Deploy to cloud platform (Heroku, AWS, DigitalOcean, etc.)
