// emailService.js

const nodemailer = require('nodemailer');

// We rely on AIM_USER and AIM_PASS from .env 
// e.g. AIM_USER=pau1magic@aim.com, AIM_PASS=oeruahhbiljoeiqj
async function sendEmail({ to, subject, text, html }) {
  // Create a transporter using AOL's SMTP
  const transporter = nodemailer.createTransport({
    host: 'smtp.aol.com',
    port: 465,
    secure: true, // using SSL
    auth: {
      user: process.env.AIM_USER, // e.g. 'pau1magic@aim.com'
      pass: process.env.AIM_PASS  // e.g. 'oeruahhbiljoeiqj'
    }
  });

  const mailOptions = {
    from: process.env.AIM_USER, // "from" address read from .env
    to,                         // The recipient(s)
    subject,
    text,
    html
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { sendEmail };
