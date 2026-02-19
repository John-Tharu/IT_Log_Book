import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const testAccount = await nodemailer.createTestAccount();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASS, // App password
  },
});

export const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `IT Daily Log Book | < ${process.env.EMAIL_ADDRESS} >`,
    to,
    subject,
    html,
  });

  return "Email sent successfully";
};
