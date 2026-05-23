import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { initializeDatabase } from './config/schema';
import authRoutes from './routes/auth';
import sportsRoutes from './routes/sports';
import eventsRoutes from './routes/events';
import paymentsRoutes from './routes/payments';
import usersRoutes from './routes/users';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
initializeDatabase().catch(console.error);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sports', sportsRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/users', usersRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
