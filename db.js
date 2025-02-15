// db.js

require('dotenv').config(); // Loads environment variables from .env
const { Pool } = require('pg');

// Create one Pool instance with your .env config
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT
});

module.exports = pool;
