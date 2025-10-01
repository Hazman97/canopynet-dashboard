// server.js (Node.js Backend - PostgreSQL Version without UUID - Email Fix)

// Import necessary modules
const express = require('express')
const { Pool } = require('pg')
const bcrypt = require('bcryptjs')
const cors = require('cors')
const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
require('dotenv').config()

// Initialize the Express application
const app = express()
const port = 3000

// Middleware
app.use(express.json())
const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
}
app.use(cors(corsOptions))

// --- SWAGGER SETUP START ---

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CanopyNet API',
      version: '1.0.0',
      description: 'A simple Express API for user registration and login with an advanced schema.',
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        RegisterInput: {
          type: 'object',
          required: ['username', 'password', 'role'],
          properties: {
            username: { type: 'string', example: 'newuser' },
            password: { type: 'string', example: 'password123' },
            role: { type: 'string', example: 'worker' },
            email: {
              type: 'string',
              example: 'user@example.com',
              nullable: true,
              description: 'Optional. Can be omitted or an empty string.',
            }, // <-- UPDATED
          },
        },
        LoginInput: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: { type: 'string', example: 'testuser' },
            password: { type: 'string', example: 'password123' },
          },
        },
        UserResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Login successful!' },
            id: { type: 'integer', example: 1 },
            username: { type: 'string', example: 'testuser' },
            email: { type: 'string', example: 'test@example.com', nullable: true },
            role: { type: 'string', example: 'normal' },
            created_at: { type: 'string', example: '2023-10-27T10:00:00.000Z' },
            last_login: { type: 'string', example: '2023-10-27T11:30:00.000Z', nullable: true },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Username already exists.' },
          },
        },
        WorkerInput: {
          type: 'object',
          required: ['name', 'code', 'workDivision', 'role', 'status', 'blockNo', 'taskNo'],
          properties: {
            name: { type: 'string', example: 'John Doe' },
            code: { type: 'string', example: 'WKR-001' },
            workDivision: { type: 'string', example: 'Planting' },
            role: { type: 'string', example: 'Team Lead' },
            status: { type: 'string', example: 'Active' },
            blockNo: { type: 'string', example: 'A12' },
            taskNo: { type: 'string', example: 'TSK-45' },
          },
        },
        WorkerResponse: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'John Doe' },
            code: { type: 'string', example: 'WKR-001' },
            workDivision: { type: 'string', example: 'Planting' },
            role: { type: 'string', example: 'Team Lead' },
            status: { type: 'string', example: 'Active' },
            blockNo: { type: 'string', example: 'A12' },
            taskNo: { type: 'string', example: 'TSK-45' },
            lastUpdate: { type: 'string', example: '2023-10-27T12:00:00.000Z' },
          },
        },
      },
    },
  },
  apis: ['./server.js'],
}

const specs = swaggerJsdoc(swaggerOptions)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))

// --- SWAGGER SETUP END ---

// --- PostgreSQL Database Configuration ---
const pool = new Pool({
  user: process.env.DB_USER || 'canopynet_user',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'canopynet_db',
  password: process.env.DB_PASSWORD || '30884990',
  port: process.env.DB_PORT || 5432,
})

// --- Database Connection Test and Initialization (FIXED) ---
// --- Database Connection Test and Initialization (CORRECTED FOR DATA PERSISTENCE) ---
let client
pool
  .connect()
  .then((connectedClient) => {
    client = connectedClient
    console.log('Connected to the PostgreSQL database.')

    // The DROP TABLE line has been removed to prevent data loss.

    // This command will only create the table if it doesn't already exist.
    return client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        worker_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW(),
        last_login TIMESTAMP
      )
    `)
  })
  .then(() => {
    console.log('Users table is ready.')
    // The rest of your logic to add a default user is already smart enough
    // to not create a duplicate if it already exists.
    return client.query(`SELECT * FROM users WHERE username = $1`, ['testuser'])
  })
 .then(async () => { // <-- Make this .then() block async so we can use await
    console.log('Workers table is ready.');

    // Check if default user exists
    const userCheck = await client.query(`SELECT * FROM users WHERE username = $1`, ['testuser']);
    if (userCheck.rows.length === 0) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      await client.query(`INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4)`, ['testuser', 'test@example.com', hashedPassword, 'normal']);
      console.log('Default user "testuser" added.');
    } else {
      console.log('Default user "testuser" already exists.');
    }

    // Check if sample workers exist
    const workerCheck = await client.query(`SELECT * FROM workers WHERE code = $1`, ['WKR-001']); // <-- ADDED await
    if (workerCheck.rows.length === 0) {
      await client.query(`INSERT INTO workers (name, code, workDivision, role, status, blockNo, taskNo) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        ['Alice Smith', 'WKR-001', 'Harvesting', 'Picker', 'Active', 'B05', 'TSK-101']
      );
      await client.query(`INSERT INTO workers (name, code, workDivision, role, status, blockNo, taskNo) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        ['Bob Johnson', 'WKR-002', 'Planting', 'Planter', 'On Leave', 'C11', 'TSK-102']
      );
      console.log('Sample workers added.');
    } else {
      console.log('Sample workers already exist.');
    }
  })

  .catch((err) => {
    console.error('Error with database initialization:', err.message)
  })
  .finally(() => {
    if (client) {
      client.release()
    }
  })
  .catch((err) => {
    console.error('Error connecting to PostgreSQL database:', err.message)
    process.exit(1)
  })

// --- Registration API Endpoint (MODIFIED) ---
/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account. Username, password, and role are required. Email is optional.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       201:
 *         description: User registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       409:
 *         description: Conflict (username or email already exists).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
app.post('/api/register', async (req, res) => {
  const { username, password, role, email } = req.body

  if (!username || !password || !role) {
    return res.status(400).json({ message: 'Username, password, and role are required.' })
  }

  // FIX: Treat empty string as no email provided
  const emailToSave = email && email.trim() !== '' ? email : null

  let client
  try {
    client = await pool.connect()

    const existingUser = await client.query(`SELECT id FROM users WHERE username = $1`, [username])
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: 'Username already exists.' })
    }

    // ADDED: Check if email already exists (only if an email was actually provided)
    if (emailToSave) {
      const existingEmail = await client.query(`SELECT id FROM users WHERE email = $1`, [
        emailToSave,
      ])
      if (existingEmail.rows.length > 0) {
        return res.status(409).json({ message: 'Email already exists.' })
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    // CHANGED: Use emailToSave in the INSERT statement
    const newUserResult = await client.query(
      `INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING *`,
      [username, emailToSave, hashedPassword, role],
    )
    const newUser = newUserResult.rows[0]

    res.status(201).json({ message: 'User registered successfully!', ...newUser })
  } catch (err) {
    console.error('Database error during registration:', err.message)
    res.status(500).json({ message: 'Internal server error.' })
  } finally {
    if (client) {
      client.release()
    }
  }
})

// --- Login API Endpoint (MODIFIED) ---
/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Log in a user
 *     description: Authenticates a user and updates their last login timestamp.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Login successful.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       401:
 *         description: Invalid credentials.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' })
  }

  let client
  try {
    client = await pool.connect()

    const result = await client.query(
      `SELECT id, username, email, password_hash, role FROM users WHERE username = $1`,
      [username],
    )
    const user = result.rows[0]

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password.' })
    }

    const isMatch = await bcrypt.compare(password, user.password_hash)

    if (isMatch) {
      await client.query(`UPDATE users SET last_login = NOW() WHERE id = $1`, [user.id])

      const updatedUserResult = await client.query(
        `SELECT id, username, email, role, created_at, last_login FROM users WHERE id = $1`,
        [user.id],
      )
      const updatedUser = updatedUserResult.rows[0]

      return res.status(200).json({
        message: 'Login successful!',
        ...updatedUser,
      })
    } else {
      return res.status(401).json({ message: 'Invalid username or password.' })
    }
  } catch (err) {
    console.error('Database error during login:', err.message)
    return res.status(500).json({ message: 'Internal server error.' })
  } finally {
    if (client) {
      client.release()
    }
  }
})

// --- Start the server ---
app.listen(3000, '::', () => {
  console.log('Server running on port 3000 (IPv4 & IPv6)')
  console.log(`Swagger UI available at http://localhost:${port}/api-docs`)
})

// --- Graceful shutdown ---
process.on('SIGINT', () => {
  console.log('Received SIGINT signal. Closing PostgreSQL connection pool...')
  pool
    .end()
    .then(() => {
      console.log('PostgreSQL connection pool closed successfully.')
      process.exit(0)
    })
    .catch((err) => {
      console.error('Error closing PostgreSQL connection pool:', err.message)
      process.exit(1)
    })
})
