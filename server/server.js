// server/server.js

require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const Stripe = require('stripe');

const app = express();
const PORT = process.env.PORT || 5000;

// Postgres
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT
});

// Nodemailer (AIM example)
const transporter = nodemailer.createTransport({
  host: 'smtp.aol.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.AIM_USER,
    pass: process.env.AIM_PASS
  }
});

// Twilio
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;
const twilioClient = twilio(accountSid, authToken);

// Stripe (Secret Key from .env)
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(express.json());

// Simple test route
app.get('/', (req, res) => {
  res.send('Server is running. Routes: /book-call, /send-sms, /create-payment-intent');
});

/**
 * POST /book-call
 * Insert booking data + send emails (unchanged)
 */
app.post('/book-call', async (req, res) => {
  try {
    const { name, email, phone, service_type } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required.' });
    }

    // Insert into Postgres
    const insertQuery = `
      INSERT INTO accounts (name, email, phone, service_type)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, phone, service_type, created_at
    `;
    const result = await pool.query(insertQuery, [name, email, phone, service_type]);
    const newAccount = result.rows[0];

    // Email to YOU
    const mailOptionsToMe = {
      from: `Consulting Website <${process.env.AIM_USER}>`,
      to: 'pau1magic@aim.com',
      subject: `New Booking from ${newAccount.name}`,
      text: `
A new booking was created:

Name: ${newAccount.name}
Email: ${newAccount.email}
Phone: ${newAccount.phone}
Service Type: ${newAccount.service_type}
Created At: ${newAccount.created_at}
      `
    };
    await transporter.sendMail(mailOptionsToMe);

    // Confirmation email to USER
    const mailOptionsToUser = {
      from: `Consulting Website <${process.env.AIM_USER}>`,
      to: email,
      subject: 'Thank You for Booking with Us!',
      text: `Hello ${name}, thanks for booking. We'll be in touch soon.`
    };
    await transporter.sendMail(mailOptionsToUser);

    res.status(201).json({
      message: 'Booking submitted successfully, emails sent!',
      account: newAccount
    });
  } catch (error) {
    console.error('Error inserting booking or sending emails:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /send-sms
 * Twilio SMS route
 */
app.post('/send-sms', async (req, res) => {
  try {
    const { to, message } = req.body;
    if (!to || !message) {
      return res.status(400).json({ error: 'Missing "to" or "message".' });
    }

    const twilioResponse = await twilioClient.messages.create({
      body: message,
      from: fromNumber,
      to
    });

    res.json({
      success: true,
      sid: twilioResponse.sid,
      status: twilioResponse.status
    });
  } catch (error) {
    console.error('Error sending SMS:', error);
    res.status(500).json({ error: 'Failed to send SMS.' });
  }
});

/**
 * POST /create-payment-intent
 * Accepts { items: [...], } from the cart
 * Calculates total in cents, creates PaymentIntent => returns clientSecret
 */
app.post('/create-payment-intent', async (req, res) => {
  try {
    const { items } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'No items provided.' });
    }

    let totalAmount = 0;
    items.forEach((item) => {
      const qty = item.quantity || 1;
      // If item.price <= 0 => fallback to $0.50
      if (item.price <= 0) {
        totalAmount += 50 * qty;
      } else {
        totalAmount += item.price * 100 * qty;
      }
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: 'usd'
      // Optionally add metadata or receipt_email
    });

    return res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return res.status(500).json({ error: 'Could not create PaymentIntent' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
