// emailService.js

const nodemailer = require('nodemailer');

async function sendEmail({ to, subject, text, html }) {
  // Create a transporter using AOL's SMTP
  const transporter = nodemailer.createTransport({
    host: 'smtp.aol.com',
    port: 465,      // or 587 if you prefer TLS
    secure: true,   // set to false if using port 587/TLS
    auth: {
      user: process.env.AOL_USER,     // e.g. yourname@aol.com
      pass: process.env.AOL_PASSWORD  // your AOL password
    }
  });

  const mailOptions = {
    from: process.env.AOL_USER,
    to,
    subject,
    text,
    html
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { sendEmail };
