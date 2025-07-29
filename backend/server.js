// server.js (Node.js Backend - PostgreSQL Version)

// Import necessary modules
const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const cors = require('cors');
require('dotenv').config();

// Initialize the Express application
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// --- PostgreSQL Database Configuration ---
const pool = new Pool({
  user: process.env.DB_USER || 'canopynet_user',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'canopynet_db',
  password: process.env.DB_PASSWORD || '30884990',
  port: process.env.DB_PORT || 5432,
});

// --- Database Connection Test and Initialization ---
pool.connect()
  .then(client => {
    console.log('Connected to the PostgreSQL database.');
    return client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password TEXT NOT NULL, -- Changed to TEXT for potentially longer hashes
        role VARCHAR(50) DEFAULT 'normal' -- ADDED: Role column
      )
    `)
    .then(() => {
      console.log('Users table created or already exists.');
      // Check if a default user exists. If not, insert one for testing.
      return client.query(`SELECT * FROM users WHERE username = $1`, ['testuser']);
    })
    .then(async (result) => {
      if (result.rows.length === 0) {
        const hashedPassword = await bcrypt.hash('password123', 10);
        return client.query(`INSERT INTO users (username, password, role) VALUES ($1, $2, $3)`, ['testuser', hashedPassword, 'normal']) // MODIFIED: Added role
          .then(() => {
            console.log('Default user "testuser" with password "password123" added.');
          });
      } else {
        console.log('Default user "testuser" already exists.');
        // Ensure testuser has a 'normal' role if it was created before the column existed
        // This is a one-time adjustment if you didn't run the ALTER TABLE UPDATE earlier
        if (!result.rows[0].role) {
            return client.query(`UPDATE users SET role = $1 WHERE username = $2`, ['normal', 'testuser'])
                .then(() => console.log('Updated testuser role to normal.'));
        }
      }
    })
    .catch(err => {
      console.error('Error with database initialization:', err.message);
    })
    .finally(() => {
      client.release();
    });
  })
  .catch(err => {
    console.error('Error connecting to PostgreSQL database:', err.message);
    process.exit(1);
  });

// --- NEW: Registration API Endpoint ---
app.post('/api/register', async (req, res) => {
    const { username, password, role } = req.body; // 'role' is optional, defaults to 'normal'

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    let client;
    try {
        client = await pool.connect();

        // Check if username already exists
        const existingUser = await client.query(`SELECT id FROM users WHERE username = $1`, [username]);
        if (existingUser.rows.length > 0) {
            return res.status(409).json({ message: 'Username already exists.' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10); // 10 salt rounds

        // Insert new user with specified role (or default 'normal')
        const userRole = role || 'normal'; // Use provided role or default to 'normal'
        await client.query(`INSERT INTO users (username, password, role) VALUES ($1, $2, $3)`, [username, hashedPassword, userRole]);

        res.status(201).json({ message: 'User registered successfully!', username, role: userRole });
    } catch (err) {
        console.error('Database error during registration:', err.message);
        res.status(500).json({ message: 'Internal server error.' });
    } finally {
        if (client) {
            client.release();
        }
    }
});


// --- Login API Endpoint (MODIFIED to return role) ---
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  let client;
  try {
    client = await pool.connect();

    // Select the user and their role
    const result = await client.query(`SELECT id, username, password, role FROM users WHERE username = $1`, [username]); // MODIFIED: Added role to SELECT
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      // Login successful - return the user's role
      return res.status(200).json({ message: 'Login successful!', username: user.username, role: user.role }); // MODIFIED: Added role to response
    } else {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }
  } catch (err) {
    console.error('Database error during login:', err.message);
    return res.status(500).json({ message: 'Internal server error.' });
  } finally {
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
process.on('SIGINT', () => {
  console.log('Received SIGINT signal. Closing PostgreSQL connection pool...');
  pool.end()
    .then(() => {
      console.log('PostgreSQL connection pool closed successfully.');
      process.exit(0);
    })
    .catch(err => {
      console.error('Error closing PostgreSQL connection pool:', err.message);
      process.exit(1);
    });
});