import pool from '../config/database';
import { Sport } from '../types/models';

export class SportService {
  async createSport(sportData: Partial<Sport>): Promise<Sport> {
    const { name, description, logo_url, url_slug, admin_id } = sportData;

    if (!name || !url_slug) {
      throw new Error('Missing required fields');
    }

    const result = await pool.query(
      `INSERT INTO sports (name, description, logo_url, url_slug, admin_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, description, logo_url, url_slug, admin_id]
    );

    return result.rows[0];
  }

  async getSportById(id: string): Promise<Sport | null> {
    const result = await pool.query('SELECT * FROM sports WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async getSportBySlug(slug: string): Promise<Sport | null> {
    const result = await pool.query('SELECT * FROM sports WHERE url_slug = $1', [slug]);
    return result.rows[0] || null;
  }

  async getAllSports(): Promise<Sport[]> {
    const result = await pool.query('SELECT * FROM sports ORDER BY name');
    return result.rows;
  }

  async updateSport(id: string, sportData: Partial<Sport>): Promise<Sport> {
    const { name, description, logo_url, url_slug, admin_id } = sportData;

    const result = await pool.query(
      `UPDATE sports
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           logo_url = COALESCE($3, logo_url),
           url_slug = COALESCE($4, url_slug),
           admin_id = COALESCE($5, admin_id),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING *`,
      [name, description, logo_url, url_slug, admin_id, id]
    );

    if (!result.rows[0]) throw new Error('Sport not found');
    return result.rows[0];
  }

  async deleteSport(id: string): Promise<boolean> {
    const result = await pool.query('DELETE FROM sports WHERE id = $1', [id]);
    return result.rowCount! > 0;
  }

  async assignAdmin(sportId: string, adminId: string): Promise<void> {
    await pool.query(
      `INSERT INTO sport_admins (sport_id, admin_id) VALUES ($1, $2)
       ON CONFLICT (sport_id, admin_id) DO NOTHING`,
      [sportId, adminId]
    );
  }

  async removeAdmin(sportId: string, adminId: string): Promise<void> {
    await pool.query(
      'DELETE FROM sport_admins WHERE sport_id = $1 AND admin_id = $2',
      [sportId, adminId]
    );
  }
}

export const sportService = new SportService();
