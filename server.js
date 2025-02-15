// server.js

require('dotenv').config(); // Load all environment variables from .env
const express = require('express');
const cors = require('cors');
const path = require('path');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const Stripe = require('stripe');
const pool = require('./db'); // Import the single Pool instance

// Create our Express app
const app = express();

// For environment port or fallback 5000
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Twilio
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;
const twilioClient = twilio(accountSid, authToken);

// Stripe
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Nodemailer (AIM / AOL example)
const transporter = nodemailer.createTransport({
  host: 'smtp.aol.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.AIM_USER,
    pass: process.env.AIM_PASS
  }
});

/**
 * (Optional) Test route at /api/test
 * You can visit https://<your-app>/api/test to confirm server is running
 */
app.get('/api/test', (req, res) => {
  res.send('Server is running. Routes: /book-call, /send-sms, /create-payment-intent, /complete-order');
});

/**
 * POST /book-call
 * Insert booking + send emails
 */
app.post('/book-call', async (req, res) => {
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
    console.error('Error in /book-call:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /send-sms
 * Twilio SMS
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
 * For Stripe Payment
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
      // fallback if item.price <= 0 => $0.50
      if (item.price <= 0) {
        totalAmount += 50 * qty;
      } else {
        totalAmount += item.price * 100 * qty;
      }
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: 'usd'
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: 'Could not create PaymentIntent' });
  }
});

/**
 * POST /complete-order
 * After a successful Stripe payment, we send an email to you + the user
 */
app.post('/complete-order', async (req, res) => {
  try {
    const { name, email, phone, cartItems, total } = req.body;
    if (!name || !email || !cartItems) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    // (A) Email to YOU with purchase details
    const mailOptionsToMe = {
      from: `Consulting Website <${process.env.AIM_USER}>`,
      to: 'pau1magic@aim.com',
      subject: `New Purchase from ${name}`,
      text: `
A new purchase was completed:

Name: ${name}
Email: ${email}
Phone: ${phone || 'N/A'}

Items:
${cartItems
  .map((i) => `${i.name} x${i.quantity || 1} = $${i.price}`)
  .join('\n')}

Total: $${total}

- Sent automatically from your website.
      `
    };
    await transporter.sendMail(mailOptionsToMe);

    // (B) Confirmation email to USER
    const mailOptionsToUser = {
      from: `Consulting Website <${process.env.AIM_USER}>`,
      to: email,
      subject: 'Thank You for Your Purchase!',
      text: `Hello ${name},

Thank you for your purchase!

You bought:
${cartItems
  .map((i) => `${i.name} x${i.quantity || 1} = $${i.price}`)
  .join('\n')}

Total: $${total}

We appreciate your business! We'll be in touch soon.

Best regards,
Your Consulting Website
`
    };
    await transporter.sendMail(mailOptionsToUser);

    res.json({ message: 'Order emails sent successfully!' });
  } catch (error) {
    console.error('Error in /complete-order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve React build in production
app.use(express.static(path.join(__dirname, 'client', 'build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

// Listen on the environment's PORT or 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
