const transporter = require("../utils/nodemailer");
require('dotenv').config();

exports.sentEmail = async (receiverEmail, emailSubject, emailHtml) => {
  try {

    const mailOptions = {
      from: process.env.ETHEREAL_YOUR_EMAIL,
      to: receiverEmail,
      subject: emailSubject,
      html: emailHtml,
    }

    await transporter.sendMail(mailOptions);

  } catch (error) {
    console.error(error);
  }
}