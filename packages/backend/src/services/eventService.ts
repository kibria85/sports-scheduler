import pool from '../config/database';
import { SportEvent, Team, EventRole, PlayerRegistration } from '../types/models';

export class EventService {
  async createEvent(eventData: Partial<SportEvent>): Promise<SportEvent> {
    const { sport_id, name, description, start_date, end_date, created_by } = eventData;

    if (!sport_id || !name || !start_date || !end_date || !created_by) {
      throw new Error('Missing required fields');
    }

    const result = await pool.query(
      `INSERT INTO sport_events (sport_id, name, description, start_date, end_date, created_by)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [sport_id, name, description, start_date, end_date, created_by]
    );

    return result.rows[0];
  }

  async getEventById(id: string): Promise<SportEvent | null> {
    const result = await pool.query('SELECT * FROM sport_events WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async getEventsBySport(sportId: string): Promise<SportEvent[]> {
    const result = await pool.query(
      'SELECT * FROM sport_events WHERE sport_id = $1 ORDER BY start_date',
      [sportId]
    );
    return result.rows;
  }

  async createTeam(teamData: Partial<Team>): Promise<Team> {
    const { sport_event_id, name, logo_url } = teamData;

    if (!sport_event_id || !name) {
      throw new Error('Missing required fields');
    }

    const result = await pool.query(
      `INSERT INTO teams (sport_event_id, name, logo_url)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [sport_event_id, name, logo_url]
    );

    return result.rows[0];
  }

  async getTeamsByEvent(eventId: string): Promise<Team[]> {
    const result = await pool.query(
      'SELECT * FROM teams WHERE sport_event_id = $1',
      [eventId]
    );
    return result.rows;
  }

  async createEventRole(roleData: Partial<EventRole>): Promise<EventRole> {
    const { sport_event_id, role_name, fee } = roleData;

    if (!sport_event_id || !role_name) {
      throw new Error('Missing required fields');
    }

    const result = await pool.query(
      `INSERT INTO event_roles (sport_event_id, role_name, fee)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [sport_event_id, role_name, fee || 0]
    );

    return result.rows[0];
  }

  async getEventRoles(eventId: string): Promise<EventRole[]> {
    const result = await pool.query(
      'SELECT * FROM event_roles WHERE sport_event_id = $1',
      [eventId]
    );
    return result.rows;
  }

  async registerPlayer(registrationData: Partial<PlayerRegistration>): Promise<PlayerRegistration> {
    const {
      sport_event_id,
      player_id,
      team_id,
      role,
      jersey_name,
      jersey_number,
      jersey_size,
      skill_level,
      available_dates,
      fee_amount
    } = registrationData;

    if (!sport_event_id || !player_id || !role) {
      throw new Error('Missing required fields');
    }

    const result = await pool.query(
      `INSERT INTO player_registrations
       (sport_event_id, player_id, team_id, role, jersey_name, jersey_number, jersey_size, skill_level, available_dates, fee_amount)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [sport_event_id, player_id, team_id, role, jersey_name, jersey_number, jersey_size, skill_level, available_dates, fee_amount]
    );

    return result.rows[0];
  }

  async getPlayerRegistration(eventId: string, playerId: string): Promise<PlayerRegistration | null> {
    const result = await pool.query(
      'SELECT * FROM player_registrations WHERE sport_event_id = $1 AND player_id = $2',
      [eventId, playerId]
    );
    return result.rows[0] || null;
  }

  async getEventRegistrations(eventId: string): Promise<PlayerRegistration[]> {
    const result = await pool.query(
      'SELECT * FROM player_registrations WHERE sport_event_id = $1',
      [eventId]
    );
    return result.rows;
  }

  async assignPlayerToTeam(registrationId: string, teamId: string): Promise<void> {
    await pool.query(
      'UPDATE player_registrations SET team_id = $1 WHERE id = $2',
      [teamId, registrationId]
    );
  }
}

export const eventService = new EventService();
