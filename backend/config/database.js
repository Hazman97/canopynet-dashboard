const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'canopynet_user',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'canopynet_db',
  password: process.env.DB_PASSWORD || '30884990',
  port: process.env.DB_PORT || 5432,
});

module.exports = pool;