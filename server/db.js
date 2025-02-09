// db.js
require('dotenv').config(); // If you're using a .env file
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PGUSER || 'consulting_user',
  host: process.env.PGHOST || 'localhost',
  database: process.env.PGDATABASE || 'consulting_db',
  password: process.env.PGPASSWORD || 'MySecurePassword',
  port: process.env.PGPORT || 5432
});

module.exports = pool;
