import express, { Router } from 'express';
import { userService } from '../services/userService';
import { authenticate, authorize } from '../middleware/auth';

const router: Router = express.Router();

// Get all users (Super Admin only)
router.get('/', authenticate, authorize('super_admin'), async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users.map(u => ({ ...u, password: undefined })));
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({ ...user, password: undefined });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Update user profile
router.put('/:id', authenticate, async (req, res) => {
  try {
    if ((req as any).user.id !== req.params.id && (req as any).user.role !== 'super_admin') {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    const user = await userService.updateUser(req.params.id, req.body);
    res.json({ ...user, password: undefined });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

export default router;
