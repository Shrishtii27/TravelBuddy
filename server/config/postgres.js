import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Use a connection pool to manage multiple connections efficiently
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 5000, // Return an error if a connection takes longer than 5 seconds
});

// Handle pool errors to prevent server crashes
pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
});

export const query = (text, params) => pool.query(text, params);

/**
 * Connects to PostgreSQL and initializes the database tables
 */
export const connectPostgres = async () => {
  let client;
  try {
    client = await pool.connect();
    console.log('✅ PostgreSQL connected successfully');
    
    // Create users table if not exists
    await initDb();
  } catch (err) {
    console.error('❌ PostgreSQL connection failed:', err.message);
    throw err;
  } finally {
    if (client) client.release();
  }
};

/**
 * Initializes required tables in the database
 */
const initDb = async () => {
  const queries = [
    // 1. Users Table
    `CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255),
      google_id VARCHAR(255),
      first_name VARCHAR(255),
      last_name VARCHAR(255),
      profile_picture TEXT,
      saved_preferences JSONB DEFAULT '{}',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );`,

    // 2. Trips Table
    `CREATE TABLE IF NOT EXISTS trips (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      destination VARCHAR(255) NOT NULL,
      start_date TIMESTAMP WITH TIME ZONE NOT NULL,
      end_date TIMESTAMP WITH TIME ZONE NOT NULL,
      budget DECIMAL(12, 2) NOT NULL DEFAULT 0,
      currency VARCHAR(10) DEFAULT 'INR',
      status VARCHAR(20) DEFAULT 'planned',
      description TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );`,

    // 3. Expenses Table
    `CREATE TABLE IF NOT EXISTS expenses (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      trip_id INTEGER REFERENCES trips(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      spent_by VARCHAR(255) NOT NULL,
      amount DECIMAL(12, 2) NOT NULL,
      category VARCHAR(50) NOT NULL,
      description TEXT,
      date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      currency VARCHAR(10) DEFAULT 'INR',
      payment_method VARCHAR(20) DEFAULT 'card',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );`,

    // 4. Itineraries Table
    `CREATE TABLE IF NOT EXISTS itineraries (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      destination VARCHAR(255) NOT NULL,
      start_date VARCHAR(50),
      end_date VARCHAR(50),
      total_days INTEGER,
      travelers INTEGER DEFAULT 2,
      itinerary_data JSONB NOT NULL,
      is_favorite BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );`,

    // 5. Notifications Table
    `CREATE TABLE IF NOT EXISTS notifications (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      type VARCHAR(20) DEFAULT 'general',
      read BOOLEAN DEFAULT false,
      related_id INTEGER,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );`,

    // 6. Posts Table
    `CREATE TABLE IF NOT EXISTS posts (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      destination VARCHAR(255),
      tags JSONB DEFAULT '[]',
      images JSONB DEFAULT '[]',
      itinerary_id INTEGER,
      trip_id INTEGER,
      view_count INTEGER DEFAULT 0,
      featured BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );`,

    // 7. Post Likes Table
    `CREATE TABLE IF NOT EXISTS post_likes (
      post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      PRIMARY KEY (post_id, user_id)
    );`,

    // 8. Comments Table
    `CREATE TABLE IF NOT EXISTS comments (
      id SERIAL PRIMARY KEY,
      post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );`,

    // 9. Journals Table
    `CREATE TABLE IF NOT EXISTS journals (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      destination VARCHAR(255) NOT NULL,
      trip_date TIMESTAMP WITH TIME ZONE NOT NULL,
      notes TEXT NOT NULL,
      images JSONB DEFAULT '[]',
      is_public BOOLEAN DEFAULT false,
      formatted_notes TEXT,
      mood VARCHAR(50),
      highlights JSONB DEFAULT '[]',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );`
  ];

  try {
    for (const queryStr of queries) {
      await query(queryStr);
    }
    console.log('✅ PostgreSQL Tables verified/initialized');
  } catch (err) {
    console.error('❌ Table initialization failed:', err.message);
  }
};

export default pool;
