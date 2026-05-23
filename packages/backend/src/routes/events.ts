import express, { Router } from 'express';
import { eventService } from '../services/eventService';
import { authenticate, authorize } from '../middleware/auth';

const router: Router = express.Router();

// Create event (Admin only)
router.post('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { sport_id, name, description, start_date, end_date } = req.body;
    const event = await eventService.createEvent({
      sport_id,
      name,
      description,
      start_date,
      end_date,
      created_by: (req as any).user.id,
    });
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Get event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await eventService.getEventById(req.params.id);
    if (!event) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }
    res.json(event);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Create team for event (Admin only)
router.post('/:eventId/teams', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { name, logo_url } = req.body;
    const team = await eventService.createTeam({
      sport_event_id: req.params.eventId,
      name,
      logo_url,
    });
    res.status(201).json(team);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Get teams for event
router.get('/:eventId/teams', async (req, res) => {
  try {
    const teams = await eventService.getTeamsByEvent(req.params.eventId);
    res.json(teams);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Create event role (Admin only)
router.post('/:eventId/roles', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { role_name, fee } = req.body;
    const role = await eventService.createEventRole({
      sport_event_id: req.params.eventId,
      role_name,
      fee,
    });
    res.status(201).json(role);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Get event roles
router.get('/:eventId/roles', async (req, res) => {
  try {
    const roles = await eventService.getEventRoles(req.params.eventId);
    res.json(roles);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Register player for event
router.post('/:eventId/register', authenticate, async (req, res) => {
  try {
    const {
      role,
      jersey_name,
      jersey_number,
      jersey_size,
      skill_level,
      available_dates,
    } = req.body;

    const registration = await eventService.registerPlayer({
      sport_event_id: req.params.eventId,
      player_id: (req as any).user.id,
      role,
      jersey_name,
      jersey_number,
      jersey_size,
      skill_level,
      available_dates,
    });

    res.status(201).json(registration);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Get player registration for event
router.get('/:eventId/registration', authenticate, async (req, res) => {
  try {
    const registration = await eventService.getPlayerRegistration(
      req.params.eventId,
      (req as any).user.id
    );
    res.json(registration);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Get all registrations for event (Admin only)
router.get('/:eventId/registrations', authenticate, authorize('admin'), async (req, res) => {
  try {
    const registrations = await eventService.getEventRegistrations(req.params.eventId);
    res.json(registrations);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Assign player to team (Admin only)
router.post('/:eventId/assign-player', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { registration_id, team_id } = req.body;
    await eventService.assignPlayerToTeam(registration_id, team_id);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

export default router;
