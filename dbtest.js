require('dotenv').config(); // Load environment variables
const { Pool } = require('pg');

// Database connection configuration
const pool = new Pool({
  connectionString: "postgresql://postgres:bsaD7qVRdBSebUVC@punctually-copious-parakeet.data-1.use1.tembo.io:5432/postgres", // Get connection string from .env
});

async function testDatabaseConnection() {
  let client; // Declare the client variable outside the try block

  try {
    // Get a connection from the pool
    client = await pool.connect();

    // Execute a simple query
    const result = await client.query('SELECT NOW()');

    // Log the result
    console.log('Database connection successful!');
    console.log('Current time from database:', result.rows[0].now);

  } catch (error) {
    console.error('Database connection error:', error);

    // Log specific error details if available
    if (error.detail) {
      console.error('PostgreSQL error detail:', error.detail);
    }
    if (error.hint) {
      console.error('PostgreSQL error hint:', error.hint);
    }
    if (error.where) {
      console.error('PostgreSQL error where:', error.where);
    }
    if (error.code) {
      console.error('PostgreSQL error code:', error.code);
    }
  } finally {
    // Release the client back to the pool
    if (client) {
      client.release();
    }
  }
}

// Run the test function
testDatabaseConnection();
