const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host : 'smtp.ethereal.email',
  port : '587',
  // service: 'gmail',
  auth: {
    user: process.env.ETHEREAL_YOUR_EMAIL,
    pass: process.env.your_pass
  }
});



module.exports = transporter;