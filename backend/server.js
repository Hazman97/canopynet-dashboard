// server.js (Node.js Backend)

// Import necessary modules
const express = require('express');
const sqlite3 = require('sqlite3').verbose(); // For SQLite database interaction
const bcrypt = require('bcryptjs'); // For hashing and comparing passwords
const cors = require('cors'); // To allow cross-origin requests from your Vue.js frontend

// Initialize the Express application
const app = express();
const port = 3000; // The port your backend server will listen on

// Middleware
app.use(express.json()); // Enable Express to parse JSON request bodies
app.use(cors()); // Enable CORS for all routes (adjust as needed for production)

// Initialize SQLite database
// 'database.sqlite' will be created in your project directory if it doesn't exist
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    // Create 'users' table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )`, (err) => {
      if (err) {
        console.error('Error creating users table:', err.message);
      } else {
        console.log('Users table created or already exists.');
        // Check if a default user exists, and if not, insert one
        // THIS IS FOR TESTING ONLY. In a real app, users would register.
        db.get(`SELECT * FROM users WHERE username = ?`, ['testuser'], async (err, row) => {
          if (err) {
            console.error('Error checking for default user:', err.message);
            return;
          }
          if (!row) {
            // Hash the default password before inserting
            const hashedPassword = await bcrypt.hash('password123', 10); // 10 is the salt rounds
            db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, ['testuser', hashedPassword], (err) => {
              if (err) {
                console.error('Error inserting default user:', err.message);
              } else {
                console.log('Default user "testuser" with password "password123" added.');
              }
            });
          } else {
            console.log('Default user "testuser" already exists.');
          }
        });
      }
    });
  }
});

// Login API Endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  // Basic validation
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  // Find the user in the database
  db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
    if (err) {
      console.error('Database error during login:', err.message);
      return res.status(500).json({ message: 'Internal server error.' });
    }

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
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Node.js backend server listening at http://localhost:${port}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    }
    console.log('Database connection closed.');
    process.exit(0);
  });
});