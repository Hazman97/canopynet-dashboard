// Import necessary modules
const express = require('express');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import database connection
const pool = require('./config/database');

// Import route files
const userRoutes = require('./routes/userRoutes');
const workerRoutes = require('./routes/workerRoutes');

// Initialize the Express application
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// --- SWAGGER SETUP ---
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CanopyNet API',
      version: '1.0.0',
      description: 'API for managing users, workers, and logs.',
    },
    servers: [{ url: `http://localhost:${port}`, description: 'Development server' }],
    components: {
      schemas: {
        RegisterInput: {
          type: 'object', required: ['username', 'password', 'role'], properties: {
            username: { type: 'string', example: 'newuser' },
            password: { type: 'string', example: 'password123' },
            role: { type: 'string', example: 'worker' },
            email: { type: 'string', example: 'user@example.com', nullable: true, description: 'Optional.' },
          },
        },
        LoginInput: {
          type: 'object', required: ['username', 'password'], properties: {
            username: { type: 'string', example: 'testuser' },
            password: { type: 'string', example: 'password123' },
          },
        },
        UserResponse: {
          type: 'object', properties: {
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
          type: 'object', properties: {
            message: { type: 'string', example: 'Username already exists.' },
          },
        },
        WorkerInput: {
          type: 'object', required: ['name', 'code', 'workDivision', 'role', 'status', 'blockNo', 'taskNo'], properties: {
            name: { type: 'string', example: 'John Doe' }, code: { type: 'string', example: 'WKR-001' },
            workDivision: { type: 'string', example: 'Planting' }, role: { type: 'string', example: 'Team Lead' },
            status: { type: 'string', example: 'Active' }, blockNo: { type: 'string', example: 'A12' },
            taskNo: { type: 'string', example: 'TSK-45' },
          },
        },
        WorkerResponse: {
          type: 'object', properties: {
            id: { type: 'integer', example: 1 }, name: { type: 'string', example: 'John Doe' },
            code: { type: 'string', example: 'WKR-001' }, workDivision: { type: 'string', example: 'Planting' },
            role: { type: 'string', example: 'Team Lead' }, status: { type: 'string', example: 'Active' },
            blockNo: { type: 'string', example: 'A12' }, taskNo: { type: 'string', example: 'TSK-45' },
            lastUpdate: { type: 'string', example: '2023-10-27T12:00:00.000Z' },
          },
        },
        WorkerLogInput: {
          type: 'object', required: ['workerId', 'date'], properties: {
            workerId: { type: 'integer', example: 1, description: 'The ID of the worker this log belongs to.' },
            date: { type: 'string', format: 'date', example: '2023-10-27' },
            attendance: { type: 'string', example: 'Present' },
            hoursWorked: { type: 'number', format: 'float', example: 8.5 },
            totalHarvest: { type: 'number', format: 'float', example: 150.75 }
          },
        },
        WorkerLogResponse: {
          type: 'object', properties: {
            id: { type: 'integer', example: 1 }, workerId: { type: 'integer', example: 1 },
            date: { type: 'string', example: '2023-10-27' }, attendance: { type: 'string', example: 'Present' },
            hoursWorked: { type: 'number', format: 'float', example: 8.5 }, totalHarvest: { type: 'number', format: 'float', example: 150.75 }
          },
        },
      },
    },
  },
  apis: ['./routes/*.js', './controllers/*.js'],
};
const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
// --- SWAGGER SETUP END ---

// --- Database Initialization (COMPLETE) ---
let client;
pool
  .connect()
  .then((connectedClient) => {
    client = connectedClient;
    console.log('Connected to the PostgreSQL database.');

    // Create Users Table
    return client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        worker_id INTEGER,
        created_at TIMESTAMP DEFAULT NOW(),
        last_login TIMESTAMP
      )
    `);
  })
  .then(() => {
    console.log('Users table is ready.');
    // Create Workers Table
    return client.query(`
      CREATE TABLE IF NOT EXISTS workers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        code VARCHAR(255),
        workDivision VARCHAR(50),
        role VARCHAR(50),
        status VARCHAR(50),
        blockNo VARCHAR(255),
        lastUpdate TIMESTAMP,
        taskNo VARCHAR(255)
      )
    `);
  })
  .then(() => {
    console.log('Workers table is ready.');
    // Create Worker Daily Logs Table
    return client.query(`
      CREATE TABLE IF NOT EXISTS worker_daily_logs (
        id SERIAL PRIMARY KEY,
        workerId INTEGER NOT NULL REFERENCES workers(id),
        date DATE NOT NULL,
        attendance VARCHAR(50),
        hoursWorked FLOAT,
        totalHarvest FLOAT,
        UNIQUE(workerId, date)
      )
    `);
  })
  .then(async () => {
    console.log('Worker daily logs table is ready.');

    // --- Handle Default User ---
    const userCheck = await client.query(`SELECT * FROM users WHERE username = $1`, ['testuser']);
    if (userCheck.rows.length === 0) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      await client.query(`INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4)`, ['testuser', 'test@example.com', hashedPassword, 'normal']);
      console.log('Default user "testuser" added.');
    } else {
      console.log('Default user "testuser" already exists.');
    }

    // --- Handle Sample Workers ---
    const workerCheck = await client.query(`SELECT * FROM workers WHERE code = $1`, ['WKR-001']);
    if (workerCheck.rows.length === 0) {
      const now = new Date().toISOString();
      await client.query(`INSERT INTO workers (name, code, workDivision, role, status, blockNo, lastUpdate, taskNo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`, ['Alice Smith', 'WKR-001', 'Harvesting', 'Picker', 'Active', 'B05', now, 'TSK-101']);
      await client.query(`INSERT INTO workers (name, code, workDivision, role, status, blockNo, lastUpdate, taskNo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`, ['Bob Johnson', 'WKR-002', 'Planting', 'Planter', 'On Leave', 'C11', now, 'TSK-102']);
      console.log('Sample workers added.');
    } else {
      console.log('Sample workers already exist.');
    }
  })
  .catch((err) => {
    console.error('Error with database initialization:', err.message);
  })
  .finally(() => {
    if (client) {
      client.release();
    }
  })
  .catch((err) => {
    console.error('Error connecting to PostgreSQL database:', err.message);
    process.exit(1);
  });

// --- Use Routes ---
app.use('/api', userRoutes);
app.use('/api/workers', workerRoutes);

// --- Start the server ---
app.listen(port, '::', () => {
  console.log(`Server running on port ${port}`);
  console.log(`Swagger UI available at http://localhost:${port}/api-docs`);
});

// --- Graceful shutdown ---
process.on('SIGINT', () => {
  console.log('Received SIGINT signal. Closing PostgreSQL connection pool...');
  pool
    .end()
    .then(() => {
      console.log('PostgreSQL connection pool closed successfully.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Error closing PostgreSQL connection pool:', err.message);
      process.exit(1);
    });
});