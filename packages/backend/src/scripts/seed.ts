import { PoolClient } from 'pg';
import pool from '../config/database';
import { hashPassword } from '../utils/auth';

export async function seedDatabase(client: PoolClient) {
  // const client = await pool.connect();

  try {
    await client.query('BEGIN');
    console.log('Seeding database...');

    // Create sample users (admin, players, sponsor)
    const hashedPassword = await hashPassword('password123');

    const users: { id: string; email: string; role: string }[] = [];

    const userRows = [
      { email: 'admin@sports.com', first: 'Admin', last: 'User', role: 'admin' },
      { email: 'player1@sports.com', first: 'John', last: 'Doe', role: 'player' },
      { email: 'player2@sports.com', first: 'Jane', last: 'Smith', role: 'player' },
      { email: 'sponsor@sports.com', first: 'Acme', last: 'Sponsor', role: 'sponsor' }
    ];

    for (const u of userRows) {
      const res = await client.query(
        `INSERT INTO users (email, password, first_name, last_name, role)
         VALUES ($1, $2, $3, $4, $5) RETURNING id, email, role`,
        [u.email, hashedPassword, u.first, u.last, u.role]
      );
      users.push(res.rows[0]);
    }

    console.log('Users created:', users);

    // Create sample sports and assign the admin as admin_id
    const sportsData = [
      { name: 'Cricket', desc: 'A bat-and-ball sport', slug: 'cricket' },
      { name: 'Badminton', desc: 'A racquet sport', slug: 'badminton' },
      { name: 'Soccer', desc: 'A team sport played with a ball', slug: 'soccer' }
    ];

    const sports: { id: string; name: string }[] = [];
    for (let i = 0; i < sportsData.length; i++) {
      const adminId = users[0].id; // admin user
      const s = sportsData[i];
      const res = await client.query(
        `INSERT INTO sports (name, description, url_slug, admin_id)
         VALUES ($1, $2, $3, $4) RETURNING id, name`,
        [s.name, s.desc, s.slug, adminId]
      );
      sports.push(res.rows[0]);
    }

    console.log('Sports created:', sports);

    // Create sample sport_events
    const events: { id: string; name: string }[] = [];
    const eventRows = [
      { sportIndex: 0, name: 'Cricket Summer Cup', start: '2026-06-01', end: '2026-06-15' },
      { sportIndex: 1, name: 'City Badminton League', start: '2026-07-01', end: '2026-07-10' }
    ];

    for (const er of eventRows) {
      const sportId = sports[er.sportIndex].id;
      const createdBy = users[0].id; // admin creates events
      const res = await client.query(
        `INSERT INTO sport_events (sport_id, name, description, start_date, end_date, created_by)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name`,
        [sportId, er.name, `${er.name} description`, er.start, er.end, createdBy]
      );
      events.push(res.rows[0]);
    }

    console.log('Events created:', events);

    // Create teams for events
    const teams: { id: string; name: string }[] = [];
    const teamsData = [
      { eventIndex: 0, name: 'Cricket Kings' },
      { eventIndex: 0, name: 'Boundary Bashers' },
      { eventIndex: 1, name: 'Shuttle Masters' }
    ];

    for (const t of teamsData) {
      const eventId = events[t.eventIndex].id;
      const res = await client.query(
        `INSERT INTO teams (sport_event_id, name, logo_url) VALUES ($1, $2, $3) RETURNING id, name`,
        [eventId, t.name, null]
      );
      teams.push(res.rows[0]);
    }

    console.log('Teams created:', teams);

    // Create event roles
    const eventRoles: { id: string; role_name: string }[] = [];
    const rolesData = [
      { eventIndex: 0, role_name: 'Player', fee: 50.0 },
      { eventIndex: 0, role_name: 'Coach', fee: 0.0 },
      { eventIndex: 1, role_name: 'Player', fee: 30.0 }
    ];

    for (const r of rolesData) {
      const eventId = events[r.eventIndex].id;
      const res = await client.query(
        `INSERT INTO event_roles (sport_event_id, role_name, fee) VALUES ($1, $2, $3) RETURNING id, role_name`,
        [eventId, r.role_name, r.fee]
      );
      eventRoles.push(res.rows[0]);
    }

    console.log('Event roles created:', eventRoles);

    // Create player registrations
    const registrationsData = [
      { eventIndex: 0, playerIndex: 1, teamIndex: 0, role: 'Player', fee_amount: 50.0 },
      { eventIndex: 0, playerIndex: 2, teamIndex: 1, role: 'Player', fee_amount: 50.0 },
      { eventIndex: 1, playerIndex: 1, teamIndex: 2, role: 'Player', fee_amount: 30.0 }
    ];

    for (const reg of registrationsData) {
      const eventId = events[reg.eventIndex].id;
      const playerId = users[reg.playerIndex].id;
      const teamId = teams[reg.teamIndex].id;
      await client.query(
        `INSERT INTO player_registrations (sport_event_id, player_id, team_id, role, jersey_name, jersey_number, jersey_size, skill_level, payment_status, fee_amount)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [eventId, playerId, teamId, reg.role, null, null, 'M', 'intermediate', 'paid', reg.fee_amount]
      );
    }

    console.log('Player registrations inserted');

    // Create sponsors
    const sponsorUser = users.find((u) => u.role === 'sponsor');
    if (sponsorUser) {
      for (const ev of events) {
        await client.query(
          `INSERT INTO sponsors (sport_event_id, user_id, name, email, phone, payment_status, amount_due, is_anonymous)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [ev.id, sponsorUser.id, 'Acme Co', 'sponsor@sports.com', '555-0100', 'pending', 500.0, false]
        );
      }
    }

    console.log('Sponsors inserted');

    // Create payments
    const paymentRows = [
      { userIndex: 1, eventIndex: 0, amount: 50.0, method: 'card', status: 'completed' },
      { userIndex: 2, eventIndex: 0, amount: 50.0, method: 'card', status: 'completed' }
    ];

    for (const p of paymentRows) {
      const userId = users[p.userIndex].id;
      const eventId = events[p.eventIndex].id;
      await client.query(
        `INSERT INTO payments (user_id, event_id, amount, payment_method, stripe_payment_id, status, paid_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
        [userId, eventId, p.amount, p.method, null, p.status]
      );
    }

    console.log('Payments inserted');

    // Ensure sport_admins entries exist for sports
    for (const s of sports) {
      await client.query(
        `INSERT INTO sport_admins (sport_id, admin_id) VALUES ($1, $2) ON CONFLICT (sport_id, admin_id) DO NOTHING`,
        [s.id, users[0].id]
      );
    }

    await client.query('COMMIT');
    console.log('Database seeding completed successfully!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error seeding database:', error);
  } finally {
    // client.release();
    // await pool.end();
  }
}

//seedDatabase();
