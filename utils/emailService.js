// backend/utils/emailService.js
const nodemailer = require('nodemailer');

const sendEmail = async (recipient, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: { user: 'your-email@gmail.com', pass: 'your-password' },
  });

  await transporter.sendMail({
    from: 'your-email@gmail.com',
    to: recipient,
    cc: 'harshadz_ics@met.edu',
    subject,
    html,
  });
};

module.exports = sendEmail;
