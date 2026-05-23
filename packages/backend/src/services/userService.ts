import pool from '../config/database';
import { User } from '../types/models';
import { hashPassword } from '../utils/auth';

export class UserService {
  async createUser(userData: Partial<User>): Promise<User> {
    const { email, password, first_name, last_name, role = 'player' } = userData;

    if (!email || !password || !first_name || !last_name) {
      throw new Error('Missing required fields');
    }

    const hashedPassword = await hashPassword(password);

    const result = await pool.query(
      `INSERT INTO users (email, password, first_name, last_name, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [email, hashedPassword, first_name, last_name, role]
    );

    return result.rows[0];
  }

  async getUserById(id: string): Promise<User | null> {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    const { first_name, last_name, phone, address, date_of_birth, photo_url, emergency_contact_name, emergency_contact_number } = userData;

    const result = await pool.query(
      `UPDATE users
       SET first_name = COALESCE($1, first_name),
           last_name = COALESCE($2, last_name),
           phone = COALESCE($3, phone),
           address = COALESCE($4, address),
           date_of_birth = COALESCE($5, date_of_birth),
           photo_url = COALESCE($6, photo_url),
           emergency_contact_name = COALESCE($7, emergency_contact_name),
           emergency_contact_number = COALESCE($8, emergency_contact_number),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING *`,
      [first_name, last_name, phone, address, date_of_birth, photo_url, emergency_contact_name, emergency_contact_number, id]
    );

    if (!result.rows[0]) throw new Error('User not found');
    return result.rows[0];
  }

  async getAllUsers(): Promise<User[]> {
    const result = await pool.query('SELECT * FROM users');
    return result.rows;
  }
}

export const userService = new UserService();
