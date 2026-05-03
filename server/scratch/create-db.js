import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Client } = pg;

// Connection string to the default 'postgres' database on port 5433
const connectionString = 'postgresql://shrishtisrivastava@localhost:5433/postgres';

async function setup() {
  const client = new Client({ connectionString });
  
  try {
    await client.connect();
    console.log('Connected to postgres database on 5433');
    
    // Check if travelbuddy exists
    const res = await client.query("SELECT 1 FROM pg_database WHERE datname = 'travelbuddy'");
    
    if (res.rowCount === 0) {
      console.log('Creating travelbuddy database...');
      await client.query('CREATE DATABASE travelbuddy');
      console.log('✅ Database travelbuddy created!');
    } else {
      console.log('Database travelbuddy already exists.');
    }
  } catch (err) {
    console.error('❌ Error during setup:', err.message);
  } finally {
    await client.end();
  }
}

setup();
