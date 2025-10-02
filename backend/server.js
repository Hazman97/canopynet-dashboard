// Import necessary modules
const express = require('express')
const cors = require('cors')
const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const bcrypt = require('bcryptjs')
require('dotenv').config()

// Import database connection
const pool = require('./config/database')

// Import route files
const userRoutes = require('./routes/userRoutes')
const workerRoutes = require('./routes/workerRoutes')
const logRoutes = require('./routes/logRoutes')
const phaseRoutes = require('./routes/phaseRoutes')
const blockRoutes = require('./routes/blockRoutes')
const areaRoutes = require('./routes/areaRoutes')
const assetRoutes = require('./routes/assetRoutes')
const activityRoutes = require('./routes/activityRoutes')
const ugvOperationRoutes = require('./routes/ugvOperationRoutes')
const networkConnectionRoutes = require('./routes/networkConnectionRoutes')
const taskRoutes = require('./routes/taskRoutes')
const workDivisionRoutes = require('./routes/workDivisionRoutes')
const blockWorkerRoutes = require('./routes/blockWorkerRoutes')
const taskAssignedWorkerRoutes = require('./routes/taskAssignedWorkerRoutes')
const taskAssignedAssetRoutes = require('./routes/taskAssignedAssetRoutes')
// Initialize the Express application
const app = express()
const port = 3000

// Middleware
app.use(express.json())
app.use(cors())

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
              description: 'Optional.',
            },
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
        WorkerLogInput: {
          type: 'object',
          required: ['workerId', 'date'],
          properties: {
            workerId: {
              type: 'integer',
              example: 1,
              description: 'The ID of the worker this log belongs to.',
            },
            date: { type: 'string', format: 'date', example: '2023-10-27' },
            attendance: { type: 'string', example: 'Present' },
            hoursWorked: { type: 'number', format: 'float', example: 8.5 },
            totalHarvest: { type: 'number', format: 'float', example: 150.75 },
          },
        },
        WorkerLogResponse: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            workerId: { type: 'integer', example: 1 },
            date: { type: 'string', example: '2023-10-27' },
            attendance: { type: 'string', example: 'Present' },
            hoursWorked: { type: 'number', format: 'float', example: 8.5 },
            totalHarvest: { type: 'number', format: 'float', example: 150.75 },
          },
        },
        PhaseInput: {
          type: 'object',
          required: [
            'name',
            'phaseNumber',
            'totalArea',
            'totalBlocks',
            'coordinates_lat',
            'coordinates_lng',
            'boundary',
            'status',
            'establishedDate',
          ],
          properties: {
            name: { type: 'string', example: 'North Orchard' },
            phaseNumber: { type: 'integer', example: 1 },
            totalArea: { type: 'number', format: 'float', example: 150.75 },
            totalBlocks: { type: 'integer', example: 12 },
            coordinates_lat: { type: 'number', format: 'float', example: 10.1234 },
            coordinates_lng: { type: 'number', format: 'float', example: -75.5678 },
            boundary: {
              type: 'object',
              description: 'GeoJSON polygon representing the boundary',
              example: { type: 'Polygon', coordinates: [[[-75.5678, 10.1234]]] },
            },
            status: { type: 'string', example: 'Active' },
            establishedDate: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-15T08:00:00.000Z',
            },
          },
        },
        PhaseResponse: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 }, // <-- Integer ID
            name: { type: 'string', example: 'North Orchard' },
            phaseNumber: { type: 'integer', example: 1 },
            totalArea: { type: 'number', format: 'float', example: 150.75 },
            totalBlocks: { type: 'integer', example: 12 },
            coordinates_lat: { type: 'number', format: 'float', example: 10.1234 },
            coordinates_lng: { type: 'number', format: 'float', example: -75.5678 },
            boundary: {
              type: 'object',
              example: { type: 'Polygon', coordinates: [[[-75.5678, 10.1234]]] },
            },
            status: { type: 'string', example: 'Active' },
            establishedDate: { type: 'string', example: '2023-01-15T08:00:00.000Z' },
          },
        },
        BlockInput: {
          type: 'object',
          required: ['name', 'blockNumber', 'phaseId', 'area'],
          properties: {
            name: { type: 'string', example: 'Block A-12' },
            blockNumber: { type: 'string', example: 'A12' },
            phaseId: {
              type: 'integer',
              example: 1,
              description: 'The ID of the phase this block belongs to.',
            },
            area: { type: 'number', format: 'float', example: 25.5 },
          },
        },
        BlockResponse: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Block A-12' },
            blockNumber: { type: 'string', example: 'A12' },
            phaseId: { type: 'integer', example: 1 },
            area: { type: 'number', format: 'float', example: 25.5 },
          },
        },
        AreaInput: {
          type: 'object',
          required: [
            'name',
            'coordinates_lat',
            'coordinates_lng',
            'size',
            'coverage',
            'status',
            'estimatedYield',
            'boundary',
            'blockId',
          ],
          properties: {
            name: { type: 'string', example: 'Section A1' },
            coordinates_lat: { type: 'number', format: 'float', example: 10.1235 },
            coordinates_lng: { type: 'number', format: 'float', example: -75.5679 },
            size: { type: 'number', format: 'float', example: 5.25 },
            coverage: { type: 'number', format: 'float', example: 0.85 },
            status: { type: 'string', example: 'Ready for Harvest' },
            estimatedYield: { type: 'number', format: 'float', example: 450.5 },
            boundary: {
              type: 'object',
              description: 'GeoJSON polygon',
              example: { type: 'Polygon', coordinates: [[[-75.5679, 10.1235]]] },
            },
            blockId: {
              type: 'integer',
              example: 1,
              description: 'The ID of the block this area belongs to.',
            },
          },
        },
        AreaResponse: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Section A1' },
            coordinates_lat: { type: 'number', format: 'float', example: 10.1235 },
            coordinates_lng: { type: 'number', format: 'float', example: -75.5679 },
            size: { type: 'number', format: 'float', example: 5.25 },
            coverage: { type: 'number', format: 'float', example: 0.85 },
            lastHarvest: { type: 'string', example: '2023-09-10T14:00:00.000Z', nullable: true },
            status: { type: 'string', example: 'Ready for Harvest' },
            estimatedYield: { type: 'number', format: 'float', example: 450.5 },
            boundary: {
              type: 'object',
              example: { type: 'Polygon', coordinates: [[[-75.5679, 10.1235]]] },
            },
            blockId: { type: 'integer', example: 1 },
          },
        },
        AssetInput: {
          type: 'object',
          required: ['name', 'type', 'category', 'status', 'model', 'images'],
          properties: {
            name: { type: 'string', example: 'John Deere Tractor' },
            type: { type: 'string', example: 'Vehicle' },
            category: { type: 'string', example: 'Heavy Machinery' },
            status: { type: 'string', example: 'Active' },
            model: { type: 'string', example: '8R 410' },
            operator: {
              type: 'integer',
              example: 1,
              nullable: true,
              description: 'ID of the worker who operates this asset.',
            },
            assignedWorker: {
              type: 'integer',
              example: 2,
              nullable: true,
              description: 'ID of the worker this asset is assigned to.',
            },
            images: {
              type: 'array',
              items: { type: 'string' },
              example: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
            },
          },
        },
        AssetResponse: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'John Deere Tractor' },
            type: { type: 'string', example: 'Vehicle' },
            category: { type: 'string', example: 'Heavy Machinery' },
            status: { type: 'string', example: 'Active' },
            model: { type: 'string', example: '8R 410' },
            operator: { type: 'integer', example: 1, nullable: true },
            assignedWorker: { type: 'integer', example: 2, nullable: true },
            images: {
              type: 'array',
              items: { type: 'string' },
              example: ['https://example.com/image1.jpg'],
            },
          },
        },
        ActivityInput: {
          type: 'object',
          required: ['workerId', 'type', 'status'],
          properties: {
            workerId: {
              type: 'integer',
              example: 1,
              description: 'The ID of the worker performing the activity.',
            },
            type: { type: 'string', example: 'Harvesting' },
            areaId: {
              type: 'integer',
              example: 1,
              nullable: true,
              description: 'The ID of the area where the activity took place.',
            },
            startTime: {
              type: 'string',
              format: 'date-time',
              example: '2023-10-27T08:00:00.000Z',
              nullable: true,
            },
            endTime: {
              type: 'string',
              format: 'date-time',
              example: '2023-10-27T16:00:00.000Z',
              nullable: true,
            },
            quantity: { type: 'number', format: 'float', example: 150.5, nullable: true },
            status: { type: 'string', example: 'In Progress' },
          },
        },
        ActivityResponse: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            workerId: { type: 'integer', example: 1 },
            type: { type: 'string', example: 'Harvesting' },
            areaId: { type: 'integer', example: 1, nullable: true },
            startTime: { type: 'string', example: '2023-10-27T08:00:00.000Z', nullable: true },
            endTime: { type: 'string', example: '2023-10-27T16:00:00.000Z', nullable: true },
            quantity: { type: 'number', format: 'float', example: 150.5, nullable: true },
            status: { type: 'string', example: 'In Progress' },
          },
        },
        UgvOperationInput: {
          type: 'object',
          required: [
            'task',
            'targetAreaId',
            'status',
            'progress',
            'batteryLevel',
            'coordinates_lat',
            'coordinates_lng',
            'speed',
            'heading',
            'path',
          ],
          properties: {
            task: { type: 'string', example: 'Spraying' },
            targetAreaId: {
              type: 'integer',
              example: 1,
              description: 'The ID of the target area for this operation.',
            },
            status: { type: 'string', example: 'In Progress' },
            progress: { type: 'number', format: 'float', example: 0.65 },
            batteryLevel: { type: 'number', format: 'float', example: 0.88 },
            coordinates_lat: { type: 'number', format: 'float', example: 10.124 },
            coordinates_lng: { type: 'number', format: 'float', example: -75.568 },
            speed: { type: 'number', format: 'float', example: 2.5 },
            heading: { type: 'number', format: 'float', example: 90.0 },
            path: {
              type: 'array',
              items: { type: 'number', format: 'float' },
              description:
                'An array of coordinates representing the path, e.g., [lat1, lng1, lat2, lng2, ...]',
              example: [10.124, -75.568, 10.1241, -75.5681, 10.1242, -75.5682],
            },
          },
        },
        UgvOperationResponse: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            task: { type: 'string', example: 'Spraying' },
            targetAreaId: { type: 'integer', example: 1 },
            status: { type: 'string', example: 'In Progress' },
            progress: { type: 'number', format: 'float', example: 0.65 },
            batteryLevel: { type: 'number', format: 'float', example: 0.88 },
            coordinates_lat: { type: 'number', format: 'float', example: 10.124 },
            coordinates_lng: { type: 'number', format: 'float', example: -75.568 },
            speed: { type: 'number', format: 'float', example: 2.5 },
            heading: { type: 'number', format: 'float', example: 90.0 },
            path: {
              type: 'array',
              items: { type: 'number', format: 'float' },
              example: [10.124, -75.568, 10.1241, -75.5681],
            },
          },
        },
        NetworkConnectionInput: {
          type: 'object',
          required: ['signalStrength', 'quality', 'bandwidth', 'latency', 'status'],
          properties: {
            signalStrength: { type: 'number', format: 'float', example: -65 },
            quality: { type: 'string', example: 'Good' },
            bandwidth: { type: 'number', format: 'float', example: 150.5 },
            latency: { type: 'number', format: 'float', example: 25 },
            status: { type: 'string', example: 'Connected' },
          },
        },
        NetworkConnectionResponse: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            signalStrength: { type: 'number', format: 'float', example: -65 },
            quality: { type: 'string', example: 'Good' },
            bandwidth: { type: 'number', format: 'float', example: 150.5 },
            latency: { type: 'number', format: 'float', example: 25 },
            status: { type: 'string', example: 'Connected' },
          },
        },
        WorkDivisionInput: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string', example: 'Harvesting' },
          },
        },
        WorkDivisionResponse: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Harvesting' },
          },
        },
        TaskInput: {
          type: 'object',
          required: [
            'title',
            'type',
            'status',
            'progress',
            'createdById',
            'workDivisionId',
            'workNature',
          ],
          properties: {
            title: { type: 'string', example: 'Spray Section A1' },
            type: { type: 'string', example: 'Spraying' },
            targetAreaId: {
              type: 'integer',
              example: 1,
              nullable: true,
              description: 'The ID of the target area.',
            },
            blockId: {
              type: 'integer',
              example: 1,
              nullable: true,
              description: 'The ID of the target block.',
            },
            status: { type: 'string', example: 'In Progress' },
            startDate: {
              type: 'string',
              format: 'date-time',
              example: '2023-10-27T08:00:00.000Z',
              nullable: true,
            },
            endDate: {
              type: 'string',
              format: 'date-time',
              example: '2023-10-27T16:00:00.000Z',
              nullable: true,
            },
            actualDuration: { type: 'number', format: 'float', example: 8.0, nullable: true },
            progress: { type: 'number', format: 'float', example: 0.5 },
            createdById: {
              type: 'integer',
              example: 1,
              description: 'The ID of the worker who created this task.',
            },
            workDivisionId: {
              type: 'integer',
              example: 1,
              description: 'The ID of the work division.',
            },
            workNature: { type: 'string', example: 'Pesticide Application' },
          },
        },
        TaskResponse: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            title: { type: 'string', example: 'Spray Section A1' },
            type: { type: 'string', example: 'Spraying' },
            targetAreaId: { type: 'integer', example: 1, nullable: true },
            blockId: { type: 'integer', example: 1, nullable: true },
            status: { type: 'string', example: 'In Progress' },
            startDate: { type: 'string', example: '2023-10-27T08:00:00.000Z', nullable: true },
            endDate: { type: 'string', example: '2023-10-27T16:00:00.000Z', nullable: true },
            actualDuration: { type: 'number', format: 'float', example: 8.0, nullable: true },
            progress: { type: 'number', format: 'float', example: 0.5 },
            createdById: { type: 'integer', example: 1 },
            createdAt: { type: 'string', example: '2023-10-27T07:55:00.000Z' },
            updatedAt: { type: 'string', example: '2023-10-27T12:30:00.000Z' },
            workDivisionId: { type: 'integer', example: 1 },
            workNature: { type: 'string', example: 'Pesticide Application' },
          },
        },
        WorkDivisionInput: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string', example: 'Harvesting' },
            workNatures: {
              type: 'array',
              items: { type: 'string' },
              example: ['Manual Picking', 'Machine Harvesting'],
              description: 'A list of specific work natures within this division.',
            },
          },
        },
        WorkDivisionResponse: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Harvesting' },
            workNatures: {
              type: 'array',
              items: { type: 'string' },
              example: ['Manual Picking', 'Machine Harvesting'],
            },
          },
        },
        BlockWorkerAssignmentInput: {
          type: 'object',
          required: ['blockId', 'workerId'],
          properties: {
            blockId: { type: 'integer', example: 1, description: 'The ID of the block.' },
            workerId: { type: 'integer', example: 1, description: 'The ID of the worker.' },
          },
        },
        BlockWorkerAssignmentResponse: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            blockId: { type: 'integer', example: 1 },
            workerId: { type: 'integer', example: 1 },
          },
        },

        TaskWorkerAssignmentInput: {
          type: 'object',
          required: ['taskId', 'workerId'],
          properties: {
            taskId: { type: 'integer', example: 1, description: 'The ID of the task.' },
            workerId: { type: 'integer', example: 1, description: 'The ID of the worker.' },
          },
        },
        TaskWorkerAssignmentResponse: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            taskId: { type: 'integer', example: 1 },
            workerId: { type: 'integer', example: 1 },
          },
        },

        TaskAssetAssignmentInput: {
          type: 'object',
          required: ['taskId', 'assetId'],
          properties: {
            taskId: { type: 'integer', example: 1, description: 'The ID of the task.' },
            assetId: { type: 'integer', example: 1, description: 'The ID of the asset.' },
          },
        },
        TaskAssetAssignmentResponse: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            taskId: { type: 'integer', example: 1 },
            assetId: { type: 'integer', example: 1 },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js', './controllers/*.js'],
}
const specs = swaggerJsdoc(swaggerOptions)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))
// --- SWAGGER SETUP END ---

// --- Database Initialization (COMPLETE) ---
let client
pool
  .connect()
  .then((connectedClient) => {
    client = connectedClient
    console.log('Connected to the PostgreSQL database.')

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
    `)
  })
  .then(() => {
    console.log('Users table is ready.')
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
    `)
  })

  .then(() => {
    console.log('Workers table is ready.')
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
    `)
  })
  .then(() => {
    console.log('Worker daily logs table is ready.')
    // Create Phases Table
    return client.query(`
      CREATE TABLE IF NOT EXISTS phases (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        phaseNumber INT,
        totalArea FLOAT,
        totalBlocks INT,
        coordinates_lat FLOAT,
        coordinates_lng FLOAT,
        boundary JSONB,
        status VARCHAR(50),
        establishedDate TIMESTAMP
      )
    `)
  })
  .then(async () => {
    console.log('Phases table is ready.')

    // --- Handle Sample Phases ---
    const phaseCheck = await client.query(`SELECT * FROM phases WHERE name = $1`, ['North Orchard'])
    if (phaseCheck.rows.length === 0) {
      const sampleBoundary = {
        type: 'Polygon',
        coordinates: [
          [
            [-75.5678, 10.1234],
            [-75.5679, 10.1235],
            [-75.5677, 10.1236],
            [-75.5678, 10.1234],
          ],
        ],
      }
      await client.query(
        `INSERT INTO phases (name, phaseNumber, totalArea, totalBlocks, coordinates_lat, coordinates_lng, boundary, status, establishedDate) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          'North Orchard',
          1,
          150.75,
          12,
          10.1234,
          -75.5678,
          JSON.stringify(sampleBoundary),
          'Active',
          new Date(),
        ],
      )
      console.log('Sample phase added.')
    } else {
      console.log('Sample phase already exists.')
    }
  })
  .then(async () => {
    console.log('Worker daily logs table is ready.')

    // --- Handle Default User ---
    const userCheck = await client.query(`SELECT * FROM users WHERE username = $1`, ['testuser'])
    if (userCheck.rows.length === 0) {
      const hashedPassword = await bcrypt.hash('password123', 10)
      await client.query(
        `INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4)`,
        ['testuser', 'test@example.com', hashedPassword, 'normal'],
      )
      console.log('Default user "testuser" added.')
    } else {
      console.log('Default user "testuser" already exists.')
    }

    // --- Handle Sample Workers ---
    const workerCheck = await client.query(`SELECT * FROM workers WHERE code = $1`, ['WKR-001'])
    if (workerCheck.rows.length === 0) {
      const now = new Date().toISOString()
      await client.query(
        `INSERT INTO workers (name, code, workDivision, role, status, blockNo, lastUpdate, taskNo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        ['Alice Smith', 'WKR-001', 'Harvesting', 'Picker', 'Active', 'B05', now, 'TSK-101'],
      )
      await client.query(
        `INSERT INTO workers (name, code, workDivision, role, status, blockNo, lastUpdate, taskNo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        ['Bob Johnson', 'WKR-002', 'Planting', 'Planter', 'On Leave', 'C11', now, 'TSK-102'],
      )
      console.log('Sample workers added.')
    } else {
      console.log('Sample workers already exist.')
    }
  })
  .then(() => {
    console.log('Phases table is ready.')
    // Create Blocks Table
    return client.query(`
      CREATE TABLE IF NOT EXISTS blocks (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        blockNumber VARCHAR(255),
        phaseId INTEGER NOT NULL REFERENCES phases(id),
        area FLOAT
      )
    `)
  })
  .then(async () => {
    console.log('Blocks table is ready.')

    // --- Handle Sample Blocks ---
    // First, get the ID of the sample phase we created
    const phaseResult = await client.query(`SELECT id FROM phases WHERE name = $1`, [
      'North Orchard',
    ])
    if (phaseResult.rows.length > 0) {
      const northOrchardId = phaseResult.rows[0].id
      const blockCheck = await client.query(`SELECT * FROM blocks WHERE blockNumber = $1`, ['A12'])
      if (blockCheck.rows.length === 0) {
        await client.query(
          `INSERT INTO blocks (name, blockNumber, phaseId, area) VALUES ($1, $2, $3, $4)`,
          ['Block A-12', 'A12', northOrchardId, 25.5],
        )
        await client.query(
          `INSERT INTO blocks (name, blockNumber, phaseId, area) VALUES ($1, $2, $3, $4)`,
          ['Block A-13', 'A13', northOrchardId, 30.0],
        )
        console.log('Sample blocks added.')
      } else {
        console.log('Sample blocks already exist.')
      }
    }
  })
  .then(() => {
    console.log('Blocks table is ready.')
    // Create Areas Table
    return client.query(`
      CREATE TABLE IF NOT EXISTS areas (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        coordinates_lat FLOAT,
        coordinates_lng FLOAT,
        size FLOAT,
        coverage FLOAT,
        lastHarvest TIMESTAMP,
        status VARCHAR(50),
        estimatedYield FLOAT,
        boundary JSONB,
        blockId INTEGER NOT NULL REFERENCES blocks(id)
      )
    `)
  })
  .then(async () => {
    console.log('Areas table is ready.')

    // --- Handle Sample Areas ---
    // First, get the ID of a sample block
    const blockResult = await client.query(`SELECT id FROM blocks WHERE blockNumber = $1`, ['A12'])
    if (blockResult.rows.length > 0) {
      const blockId = blockResult.rows[0].id
      const areaCheck = await client.query(`SELECT * FROM areas WHERE name = $1`, ['Section A1'])
      if (areaCheck.rows.length === 0) {
        const sampleBoundary = {
          type: 'Polygon',
          coordinates: [
            [
              [-75.5679, 10.1235],
              [-75.568, 10.1236],
              [-75.5678, 10.1237],
              [-75.5679, 10.1235],
            ],
          ],
        }
        await client.query(
          `INSERT INTO areas (name, coordinates_lat, coordinates_lng, size, coverage, status, estimatedYield, boundary, blockId) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [
            'Section A1',
            10.1235,
            -75.5679,
            5.25,
            0.85,
            'Ready for Harvest',
            450.5,
            JSON.stringify(sampleBoundary),
            blockId,
          ],
        )
        console.log('Sample area added.')
      } else {
        console.log('Sample area already exists.')
      }
    }
  })
  .then(() => {
    console.log('Areas table is ready.')
    // Create Assets Table
    return client.query(`
      CREATE TABLE IF NOT EXISTS assets (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        type VARCHAR(50),
        category VARCHAR(50),
        status VARCHAR(50),
        model VARCHAR(255),
        operator INTEGER REFERENCES workers(id),
        assignedWorker INTEGER REFERENCES workers(id),
        images JSONB
      )
    `)
  })
  .then(async () => {
    console.log('Assets table is ready.')

    // --- Handle Sample Assets ---
    // Get IDs of sample workers
    const workerResult = await client.query(`SELECT id FROM workers LIMIT 2`)
    if (workerResult.rows.length > 0) {
      const operatorId = workerResult.rows[0].id
      const assignedWorkerId = workerResult.rows[1] ? workerResult.rows[1].id : operatorId

      const assetCheck = await client.query(`SELECT * FROM assets WHERE name = $1`, [
        'John Deere Tractor',
      ])
      if (assetCheck.rows.length === 0) {
        const sampleImages = [
          'https://example.com/tractor1.jpg',
          'https://example.com/tractor2.jpg',
        ]
        await client.query(
          `INSERT INTO assets (name, type, category, status, model, operator, assignedWorker, images) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            'John Deere Tractor',
            'Vehicle',
            'Heavy Machinery',
            'Active',
            '8R 410',
            operatorId,
            assignedWorkerId,
            JSON.stringify(sampleImages),
          ],
        )
        console.log('Sample asset added.')
      } else {
        console.log('Sample asset already exists.')
      }
    }
  })
  .then(() => {
    console.log('Assets table is ready.')
    // Create Activities Table
    return client.query(`
      CREATE TABLE IF NOT EXISTS activities (
        id SERIAL PRIMARY KEY,
        workerId INTEGER NOT NULL REFERENCES workers(id),
        type VARCHAR(50),
        areaId INTEGER REFERENCES areas(id),
        startTime TIMESTAMP,
        endTime TIMESTAMP,
        quantity FLOAT,
        status VARCHAR(50)
      )
    `)
  })
  .then(async () => {
    console.log('Activities table is ready.')

    // --- Handle Sample Activities ---
    // Get IDs of sample workers and areas
    const workerResult = await client.query(`SELECT id FROM workers LIMIT 1`)
    const areaResult = await client.query(`SELECT id FROM areas LIMIT 1`)

    if (workerResult.rows.length > 0 && areaResult.rows.length > 0) {
      const workerId = workerResult.rows[0].id
      const areaId = areaResult.rows[0].id

      const activityCheck = await client.query(
        `SELECT * FROM activities WHERE workerId = $1 AND type = $2`,
        [workerId, 'Planting'],
      )
      if (activityCheck.rows.length === 0) {
        await client.query(
          `INSERT INTO activities (workerId, type, areaId, startTime, endTime, quantity, status) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [workerId, 'Planting', areaId, new Date(), new Date(), 500, 'Completed'],
        )
        console.log('Sample activity added.')
      } else {
        console.log('Sample activity already exists.')
      }
    }
  })
  .then(() => {
    console.log('Activities table is ready.')
    // Create UGV Operations Table
    return client.query(`
      CREATE TABLE IF NOT EXISTS ugv_operations (
        id SERIAL PRIMARY KEY,
        task VARCHAR(50),
        targetAreaId INTEGER REFERENCES areas(id),
        status VARCHAR(50),
        progress FLOAT,
        batteryLevel FLOAT,
        coordinates_lat FLOAT,
        coordinates_lng FLOAT,
        speed FLOAT,
        heading FLOAT,
        path JSONB
      )
    `)
  })
  .then(async () => {
    console.log('UGV Operations table is ready.')

    // --- Handle Sample UGV Operation ---
    // Get ID of a sample area
    const areaResult = await client.query(`SELECT id FROM areas LIMIT 1`)
    if (areaResult.rows.length > 0) {
      const areaId = areaResult.rows[0].id
      const operationCheck = await client.query(`SELECT * FROM ugv_operations WHERE task = $1`, [
        'Spraying',
      ])
      if (operationCheck.rows.length === 0) {
        const samplePath = [10.124, -75.568, 10.1241, -75.5681, 10.1242, -75.5682]
        await client.query(
          `INSERT INTO ugv_operations (task, targetAreaId, status, progress, batteryLevel, coordinates_lat, coordinates_lng, speed, heading, path) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [
            'Spraying',
            areaId,
            'In Progress',
            0.65,
            0.88,
            10.124,
            -75.568,
            2.5,
            90.0,
            JSON.stringify(samplePath),
          ],
        )
        console.log('Sample UGV operation added.')
      } else {
        console.log('Sample UGV operation already exists.')
      }
    }
  })
  .then(() => {
    console.log('UGV Operations table is ready.')
    // Create Network Connections Table
    return client.query(`
      CREATE TABLE IF NOT EXISTS network_connections (
        id SERIAL PRIMARY KEY,
        signalStrength FLOAT,
        quality VARCHAR(50),
        bandwidth FLOAT,
        latency FLOAT,
        status VARCHAR(50)
      )
    `)
  })
  .then(async () => {
    console.log('Network Connections table is ready.')

    // --- Handle Sample Network Connection ---
    const connectionCheck = await client.query(
      `SELECT * FROM network_connections WHERE status = $1`,
      ['Connected'],
    )
    if (connectionCheck.rows.length === 0) {
      await client.query(
        `INSERT INTO network_connections (signalStrength, quality, bandwidth, latency, status) VALUES ($1, $2, $3, $4, $5)`,
        [-65, 'Good', 150.5, 25, 'Connected'],
      )
      console.log('Sample network connection added.')
    } else {
      console.log('Sample network connection already exists.')
    }
  })
  .then(() => {
    console.log('Network Connections table is ready.')
    // Create Work Divisions Table
    return client.query(`
      CREATE TABLE IF NOT EXISTS work_divisions (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL
      )
    `)
  })
  .then(() => {
    console.log('Work Divisions table is ready.')
    // Create Tasks Table
    return client.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255),
        type VARCHAR(50),
        targetAreaId INTEGER REFERENCES areas(id),
        blockId INTEGER REFERENCES blocks(id),
        status VARCHAR(50),
        startDate TIMESTAMP,
        endDate TIMESTAMP,
        actualDuration FLOAT,
        progress FLOAT,
        createdById INTEGER REFERENCES workers(id),
        createdAt TIMESTAMP DEFAULT NOW(),
        updatedAt TIMESTAMP,
        workDivisionId INTEGER REFERENCES work_divisions(id),
        workNature VARCHAR(255)
      )
    `)
  })
  .then(async () => {
    console.log('Tasks table is ready.')

    // --- Handle Sample Work Divisions ---
    const divisionCheck = await client.query(`SELECT * FROM work_divisions WHERE name = $1`, [
      'Harvesting',
    ])
    if (divisionCheck.rows.length === 0) {
      await client.query(`INSERT INTO work_divisions (name) VALUES ($1), ($2)`, [
        'Harvesting',
        'Planting',
      ])
      console.log('Sample work divisions added.')
    }

    // --- Handle Sample Tasks ---
    const divisionResult = await client.query(`SELECT id FROM work_divisions WHERE name = $1`, [
      'Harvesting',
    ])
    const workerResult = await client.query(`SELECT id FROM workers LIMIT 1`)
    const areaResult = await client.query(`SELECT id FROM areas LIMIT 1`)

    if (
      divisionResult.rows.length > 0 &&
      workerResult.rows.length > 0 &&
      areaResult.rows.length > 0
    ) {
      const divisionId = divisionResult.rows[0].id
      const createdById = workerResult.rows[0].id
      const targetAreaId = areaResult.rows[0].id

      const taskCheck = await client.query(`SELECT * FROM tasks WHERE title = $1`, [
        'Sample Harvesting Task',
      ])
      if (taskCheck.rows.length === 0) {
        await client.query(
          `INSERT INTO tasks (title, type, targetAreaId, status, progress, createdById, workDivisionId, workNature) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            'Sample Harvesting Task',
            'Harvesting',
            targetAreaId,
            'Pending',
            0.0,
            createdById,
            divisionId,
            'Manual picking',
          ],
        )
        console.log('Sample task added.')
      } else {
        console.log('Sample task already exists.')
      }
    }
  })
  .then(() => {
    console.log('Tasks table is ready.')
    // Create Work Divisions Table
    return client.query(`
      CREATE TABLE IF NOT EXISTS work_divisions (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        workNatures JSONB
      )
    `)
  })
  .then(async () => {
    console.log('Work Divisions table is ready.')

    // --- Handle Sample Work Divisions ---
    const divisionCheck = await client.query(`SELECT * FROM work_divisions WHERE name = $1`, [
      'Harvesting',
    ])
    if (divisionCheck.rows.length === 0) {
      const harvestingNatures = ['Manual Picking', 'Machine Harvesting']
      const plantingNatures = ['Seed Planting', 'Sapling Transplanting']

      await client.query(
        `INSERT INTO work_divisions (name, workNatures) VALUES ($1, $2), ($3, $4)`,
        [
          'Harvesting',
          JSON.stringify(harvestingNatures),
          'Planting',
          JSON.stringify(plantingNatures),
        ],
      )
      console.log('Sample work divisions added.')
    } else {
      console.log('Sample work divisions already exist.')
    }
  })
  .then(() => {
    console.log('Work Divisions table is ready.')
    // Create Junction Tables
    return client.query(`
      CREATE TABLE IF NOT EXISTS block_workers (
        id SERIAL PRIMARY KEY,
        blockId INTEGER NOT NULL REFERENCES blocks(id),
        workerId INTEGER NOT NULL REFERENCES workers(id),
        UNIQUE(blockId, workerId)
      )
    `)
  })
  .then(() => {
    console.log('Block-Workers junction table is ready.')
    return client.query(`
      CREATE TABLE IF NOT EXISTS task_assigned_workers (
        id SERIAL PRIMARY KEY,
        taskId INTEGER NOT NULL REFERENCES tasks(id),
        workerId INTEGER NOT NULL REFERENCES workers(id),
        UNIQUE(taskId, workerId)
      )
    `)
  })
  .then(() => {
    console.log('Task-Assigned-Workers junction table is ready.')
    return client.query(`
      CREATE TABLE IF NOT EXISTS task_assigned_assets (
        id SERIAL PRIMARY KEY,
        taskId INTEGER NOT NULL REFERENCES tasks(id),
        assetId INTEGER NOT NULL REFERENCES assets(id),
        UNIQUE(taskId, assetId)
      )
    `)
  })
  .then(async () => {
    console.log('Task-Assigned-Assets junction table is ready.')
    // No sample data is needed for junction tables, as they represent relationships.
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

// --- Use Routes ---
app.use('/api', userRoutes)
app.use('/api/workers', workerRoutes)
app.use('/api/worker-logs', logRoutes) // <-- ADD THIS LINE
app.use('/api/phases', phaseRoutes)
app.use('/api/blocks', blockRoutes)
app.use('/api/areas', areaRoutes)
app.use('/api/assets', assetRoutes)
app.use('/api/activities', activityRoutes)
app.use('/api/ugv-operations', ugvOperationRoutes)
app.use('/api/network-connections', networkConnectionRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/work-divisions', workDivisionRoutes)
app.use('/api/block-workers', blockWorkerRoutes)
app.use('/api/task-assigned-workers', taskAssignedWorkerRoutes)
app.use('/api/task-assigned-assets', taskAssignedAssetRoutes)

app.listen(port, '::', () => {
  console.log(`Server running on port ${port}`)
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
