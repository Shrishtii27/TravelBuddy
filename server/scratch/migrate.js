import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL.replace('localhost', '127.0.0.1')
});

const queries = [
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
    `CREATE TABLE IF NOT EXISTS post_likes (
      post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      PRIMARY KEY (post_id, user_id)
    );`,
    `CREATE TABLE IF NOT EXISTS comments (
      id SERIAL PRIMARY KEY,
      post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );`,
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

async function migrate() {
  try {
    for (const q of queries) {
      await pool.query(q);
    }
    console.log('✅ All tables migrated successfully on port 5433!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  }
}

migrate();
