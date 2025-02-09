// server.js

require('dotenv').config();
console.log('ENV variables loaded: ', process.env.PGUSER);
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

// Create a new Pool instance, using only environment variables.
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.send(`Server is running on port ${PORT}...`);
});

// Example test route to confirm DB connection
app.get('/test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ now: result.rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.get('/accounts', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM accounts');
      res.json(result.rows);
    } catch (err) {
      console.error('Error fetching accounts:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

/**
 * POST /accounts
 * Expects: { name, email, phone, service_type }
 * Inserts a record into the "accounts" table.
 */
app.post('/accounts', async (req, res) => {
  try {
    const { name, email, phone, service_type } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required.' });
    }

    const insertQuery = `
      INSERT INTO accounts (name, email, phone, service_type)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, phone, service_type, created_at
    `;
    const result = await pool.query(insertQuery, [name, email, phone, service_type]);

    res.status(201).json({
      message: 'Account created successfully',
      account: result.rows[0],
    });
  } catch (error) {
    console.error('Error inserting account:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
