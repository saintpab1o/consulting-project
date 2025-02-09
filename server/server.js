// server.js

require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 5000;

// 1) Configure Postgres from .env
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT
});

// 2) Nodemailer transporter (AIM example)
const transporter = nodemailer.createTransport({
  host: 'smtp.aol.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.AIM_USER, // e.g. pau1magic@aim.com
    pass: process.env.AIM_PASS  // e.g. your AIM app password or normal pass
  }
});

/* 
   If you were using Gmail instead, you'd do:
   const transporter = nodemailer.createTransport({
     service: 'gmail',
     auth: {
       user: process.env.GMAIL_USER,
       pass: process.env.GMAIL_PASS
     }
   });
*/

// Middleware
app.use(cors());
app.use(express.json());

// Simple root route
app.get('/', (req, res) => {
  res.send('Server is running - POST /book-call to create a new booking.');
});

/**
 * POST /book-call
 * 1) Insert booking data into 'accounts' table
 * 2) Send an email to YOU at pau1magic@aim.com with all details
 * 3) Send a confirmation email to the user (the email they entered)
 */
app.post('/book-call', async (req, res) => {
  try {
    const { name, email, phone, service_type } = req.body;

    // Basic validation
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required.' });
    }

    // (A) Insert into Postgres
    const insertQuery = `
      INSERT INTO accounts (name, email, phone, service_type)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, phone, service_type, created_at
    `;
    const result = await pool.query(insertQuery, [name, email, phone, service_type]);
    const newAccount = result.rows[0];

    // (B) Send an email to YOU with the new account info
    const mailOptionsToMe = {
      from: `Consulting Website <${process.env.AIM_USER}>`,
      to: 'pau1magic@aim.com', // YOU (any other partner's email can go here too, comma-separated)
      subject: `New Booking from ${newAccount.name}`,
      text: `Hello,

A new booking was created on the website.

Name: ${newAccount.name}
Email: ${newAccount.email}
Phone: ${newAccount.phone}
Type of Service: ${newAccount.service_type}
Created At: ${newAccount.created_at}

Best regards,
Your Consulting Website
`,
      html: `
        <h2>New Booking Received</h2>
        <p><strong>Name:</strong> ${newAccount.name}</p>
        <p><strong>Email:</strong> ${newAccount.email}</p>
        <p><strong>Phone:</strong> ${newAccount.phone}</p>
        <p><strong>Service Type:</strong> ${newAccount.service_type}</p>
        <p><strong>Created At:</strong> ${newAccount.created_at}</p>
        <hr />
        <p>This message was sent automatically from your Consulting Website.</p>
      `
    };
    await transporter.sendMail(mailOptionsToMe);

    // (C) Send a confirmation email to the USER
    const mailOptionsToUser = {
      from: `Consulting Website <${process.env.AIM_USER}>`,
      to: email, // The email user typed in the form
      subject: 'Thank You for Booking with Us!',
      text: `Hello ${name},

Thank you for booking a call with us!
We received your details and will be in touch soon.

Best Regards,
Consulting Team
`,
      html: `
        <p>Hello <strong>${name}</strong>,</p>
        <p>Thank you for booking a call with us! We have received your details:</p>
        <ul>
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Phone:</strong> ${phone || 'N/A'}</li>
          <li><strong>Service:</strong> ${service_type || 'N/A'}</li>
        </ul>
        <p>We will be in touch soon to discuss your needs.</p>
        <p>Best Regards,<br/>Consulting Team</p>
      `
    };
    await transporter.sendMail(mailOptionsToUser);

    // (D) Send success response
    res.status(201).json({
      message: 'Booking submitted successfully, emails sent!',
      account: newAccount
    });
  } catch (error) {
    console.error('Error inserting booking or sending emails:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
