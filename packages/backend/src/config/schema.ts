import pool from './database';

export async function initializeDatabase() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        address TEXT,
        date_of_birth DATE,
        photo_url VARCHAR(500),
        emergency_contact_name VARCHAR(100),
        emergency_contact_number VARCHAR(20),
        role VARCHAR(50) NOT NULL DEFAULT 'player',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Sports table
    await client.query(`
      CREATE TABLE IF NOT EXISTS sports (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        logo_url VARCHAR(500),
        url_slug VARCHAR(100) UNIQUE NOT NULL,
        admin_id UUID REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Sport Events table
    await client.query(`
      CREATE TABLE IF NOT EXISTS sport_events (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        sport_id UUID NOT NULL REFERENCES sports(id),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        created_by UUID NOT NULL REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Teams table
    await client.query(`
      CREATE TABLE IF NOT EXISTS teams (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        sport_event_id UUID NOT NULL REFERENCES sport_events(id),
        name VARCHAR(100) NOT NULL,
        logo_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Event Roles table
    await client.query(`
      CREATE TABLE IF NOT EXISTS event_roles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        sport_event_id UUID NOT NULL REFERENCES sport_events(id),
        role_name VARCHAR(50) NOT NULL,
        fee DECIMAL(10, 2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Player registrations table
    await client.query(`
      CREATE TABLE IF NOT EXISTS player_registrations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        sport_event_id UUID NOT NULL REFERENCES sport_events(id),
        player_id UUID NOT NULL REFERENCES users(id),
        team_id UUID REFERENCES teams(id),
        role VARCHAR(50) NOT NULL,
        jersey_name VARCHAR(50),
        jersey_number VARCHAR(10),
        jersey_size VARCHAR(10),
        skill_level VARCHAR(50),
        available_dates DATE[],
        payment_status VARCHAR(20) DEFAULT 'pending',
        fee_amount DECIMAL(10, 2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Sponsors table
    await client.query(`
      CREATE TABLE IF NOT EXISTS sponsors (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        sport_event_id UUID NOT NULL REFERENCES sport_events(id),
        user_id UUID REFERENCES users(id),
        name VARCHAR(100),
        email VARCHAR(255),
        phone VARCHAR(20),
        payment_status VARCHAR(20) DEFAULT 'pending',
        amount_due DECIMAL(10, 2),
        is_anonymous BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Payments table
    await client.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id),
        event_id UUID REFERENCES sport_events(id),
        amount DECIMAL(10, 2) NOT NULL,
        payment_method VARCHAR(50),
        stripe_payment_id VARCHAR(255),
        status VARCHAR(20) DEFAULT 'pending',
        paid_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Admins assignments table
    await client.query(`
      CREATE TABLE IF NOT EXISTS sport_admins (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        sport_id UUID NOT NULL REFERENCES sports(id),
        admin_id UUID NOT NULL REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(sport_id, admin_id)
      );
    `);

    await client.query('COMMIT');
    console.log('Database initialized successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Database initialization error:', error);
    throw error;
  } finally {
    client.release();
  }
}
