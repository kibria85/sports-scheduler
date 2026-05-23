import express, { Router } from 'express';
import { sportService } from '../services/sportService';
import { eventService } from '../services/eventService';
import { authenticate, authorize } from '../middleware/auth';

const router: Router = express.Router();

// Get all sports
router.get('/', async (req, res) => {
  try {
    const sports = await sportService.getAllSports();
    res.json(sports);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Get sport by slug
router.get('/:slug', async (req, res) => {
  try {
    const sport = await sportService.getSportBySlug(req.params.slug);
    if (!sport) {
      res.status(404).json({ error: 'Sport not found' });
      return;
    }
    res.json(sport);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Create sport (Super Admin only)
router.post('/', authenticate, authorize('super_admin'), async (req, res) => {
  try {
    const { name, description, logo_url, url_slug, admin_id } = req.body;
    const sport = await sportService.createSport({
      name,
      description,
      logo_url,
      url_slug,
      admin_id,
    });
    res.status(201).json(sport);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Update sport (Super Admin only)
router.put('/:id', authenticate, authorize('super_admin'), async (req, res) => {
  try {
    const sport = await sportService.updateSport(req.params.id, req.body);
    res.json(sport);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Delete sport (Super Admin only)
router.delete('/:id', authenticate, authorize('super_admin'), async (req, res) => {
  try {
    const success = await sportService.deleteSport(req.params.id);
    if (!success) {
      res.status(404).json({ error: 'Sport not found' });
      return;
    }
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Assign admin to sport (Super Admin only)
router.post('/:sportId/admins/:adminId', authenticate, authorize('super_admin'), async (req, res) => {
  try {
    await sportService.assignAdmin(req.params.sportId, req.params.adminId);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Get upcoming events for a sport
router.get('/:sportId/events', async (req, res) => {
  try {
    const events = await eventService.getEventsBySport(req.params.sportId);
    const upcoming = events.filter(e => new Date(e.end_date) > new Date());
    res.json(upcoming);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

export default router;
