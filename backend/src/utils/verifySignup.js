import nodemailer from 'nodemailer';
import crypto from 'crypto';
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASSWORD,
  }
});

function generateOtp() {
  return crypto.randomInt(100000, 999999);
}

async function sendOtpMail(to, otp) {
  const mailOptions = {
    from: process.env.USER_EMAIL,
    to,
    subject: 'Email OTP Verification',
    text: `Your OTP code is: ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error('Error sending OTP email');
  }
}

export{
    generateOtp,
    sendOtpMail
}
