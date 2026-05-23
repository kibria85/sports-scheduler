import pool from '../config/database';
import { hashPassword } from '../utils/auth';

async function seedDatabase() {
  const client = await pool.connect();

  try {
    console.log('Seeding database...');

    // Create sample sports
    const sportsResult = await client.query(
      `INSERT INTO sports (name, description, url_slug)
       VALUES
       ('Cricket', 'A bat-and-ball sport', 'cricket'),
       ('Badminton', 'A racquet sport', 'badminton'),
       ('Soccer', 'A team sport played with a ball', 'soccer')
       RETURNING id, name`
    );

    console.log('Sports created:', sportsResult.rows);

    // Create sample users
    const hashedPassword = await hashPassword('password123');
    const usersResult = await client.query(
      `INSERT INTO users (email, password, first_name, last_name, role)
       VALUES
       ('admin@sports.com', $1, 'Admin', 'User', 'admin'),
       ('player1@sports.com', $1, 'John', 'Doe', 'player'),
       ('player2@sports.com', $1, 'Jane', 'Smith', 'player'),
       ('sponsor@sports.com', $1, 'Sponsor', 'Corp', 'sponsor')
       RETURNING id, email, role`,
      [hashedPassword]
    );

    console.log('Users created:', usersResult.rows);

    // Assign admin to cricket sport
    if (sportsResult.rows[0] && usersResult.rows[0]) {
      await client.query(
        'INSERT INTO sport_admins (sport_id, admin_id) VALUES ($1, $2)',
        [sportsResult.rows[0].id, usersResult.rows[0].id]
      );
    }

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

seedDatabase();
