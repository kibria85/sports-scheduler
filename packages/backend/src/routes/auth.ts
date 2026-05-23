import express, { Router } from 'express';
import { userService } from '../services/userService';
import { generateToken, comparePasswords } from '../utils/auth';
import { authenticate } from '../middleware/auth';

const router: Router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password, first_name, last_name, role } = req.body;

    const existingUser = await userService.getUserByEmail(email);
    if (existingUser) {
      res.status(400).json({ error: 'User already exists' });
      return;
    }

    const user = await userService.createUser({
      email,
      password,
      first_name,
      last_name,
      role: role || 'player',
    });

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    res.status(201).json({ user: { ...user, password: undefined }, token });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userService.getUserByEmail(email);
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const passwordMatch = await comparePasswords(password, user.password!);
    if (!passwordMatch) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    res.json({ user: { ...user, password: undefined }, token });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await userService.getUserById((req as any).user.id);
    res.json({ user: { ...user, password: undefined } });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

export default router;
