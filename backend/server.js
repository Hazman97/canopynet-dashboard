// server.js (Node.js Backend - PostgreSQL Version)

// Import necessary modules
const express = require('express');
const { Pool } = require('pg'); // PostgreSQL client library
const bcrypt = require('bcryptjs'); // For hashing and comparing passwords
const cors = require('cors'); // To allow cross-origin requests from your Vue.js frontend
require('dotenv').config(); // Load environment variables from .env file

// Initialize the Express application
const app = express();
const port = 3000; // The port your backend server will listen on

// Middleware
app.use(express.json()); // Enable Express to parse JSON request bodies
app.use(cors()); // Enable CORS for all routes (adjust as needed for production)

// --- PostgreSQL Database Configuration ---
// Use environment variables for sensitive database credentials
const pool = new Pool({
  user: process.env.DB_USER || 'canopynet_user', // Your PostgreSQL username
  host: process.env.DB_HOST || 'localhost',      // Your PostgreSQL host
  database: process.env.DB_NAME || 'canopynet_db', // Your PostgreSQL database name
  password: process.env.DB_PASSWORD || '30884990', // Your PostgreSQL password
  port: process.env.DB_PORT || 5432,             // Default PostgreSQL port
});

// --- Database Connection Test and Initialization ---
pool.connect()
  .then(client => {
    console.log('Connected to the PostgreSQL database.');
    // Create 'users' table if it doesn't exist.
    // This serves as a safety check and also runs on first connection for new deployments.
    // In your case, it should already exist from the manual psql steps.
    return client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      )
    `)
    .then(() => {
      console.log('Users table created or already exists.');
      // Check if a default user exists. If not, insert one for testing.
      // THIS IS FOR TESTING ONLY. In a real app, users would register.
      return client.query(`SELECT * FROM users WHERE username = $1`, ['testuser']);
    })
    .then(async (result) => {
      if (result.rows.length === 0) {
        // Default user "testuser" not found, insert it
        const hashedPassword = await bcrypt.hash('password123', 10); // 10 is the salt rounds
        return client.query(`INSERT INTO users (username, password) VALUES ($1, $2)`, ['testuser', hashedPassword])
          .then(() => {
            console.log('Default user "testuser" with password "password123" added.');
          });
      } else {
        console.log('Default user "testuser" already exists.');
      }
    })
    .catch(err => {
      console.error('Error with database initialization:', err.message);
    })
    .finally(() => {
      client.release(); // Release the client back to the pool
    });
  })
  .catch(err => {
    console.error('Error connecting to PostgreSQL database:', err.message);
    // Exit the process if we can't connect to the database to prevent further errors
    process.exit(1);
  });

// --- Login API Endpoint ---
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  // Basic validation
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  let client; // Declare client variable outside try-catch for finally block
  try {
    client = await pool.connect(); // Get a client from the connection pool

    // Find the user in the database
    // Using $1 for parameterized query in pg to prevent SQL injection
    const result = await client.query(`SELECT * FROM users WHERE username = $1`, [username]);
    const user = result.rows[0]; // Access the first row from the result

    if (!user) {
      // User not found
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    // Compare the provided password with the hashed password from the database
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      // Passwords match - login successful
      // In a real application, you would generate a JWT (JSON Web Token) here
      // and send it back to the client for subsequent authenticated requests.
      // For this example, we'll just send a success message.
      return res.status(200).json({ message: 'Login successful!', username: user.username });
    } else {
      // Passwords do not match
      return res.status(401).json({ message: 'Invalid username or password.' });
    }
  } catch (err) {
    console.error('Database error during login:', err.message);
    // Send a generic error message to the client for security
    return res.status(500).json({ message: 'Internal server error.' });
  } finally {
    // Always release the client back to the pool, even if an error occurred
    if (client) {
      client.release();
    }
  }
});

// --- Start the server ---
app.listen(port, () => {
  console.log(`Node.js backend server listening at http://localhost:${port}`);
});

// --- Graceful shutdown ---
// This ensures that the database connection pool is properly closed when the server stops
process.on('SIGINT', () => {
  console.log('Received SIGINT signal. Closing PostgreSQL connection pool...');
  pool.end() // Close the connection pool
    .then(() => {
      console.log('PostgreSQL connection pool closed successfully.');
      process.exit(0); // Exit the process cleanly
    })
    .catch(err => {
      console.error('Error closing PostgreSQL connection pool:', err.message);
      process.exit(1); // Exit with an error code
    });
});