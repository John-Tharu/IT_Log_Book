import nodemailer from "nodemailer";

// Create a transporter using Ethereal test credentials.
// For production, replace with your actual SMTP server details.

const testAccount = await nodemailer.createTestAccount();

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: "kayleigh.tremblay@ethereal.email",
    pass: "sDwr2yD4mgjRwepZxW",
  },
});

export const sendEmail = async ({ to, subject, html }) => {
  const info = await transporter.sendMail({
    from: `IT Daily Log Book | < ${testAccount.user} >`,
    to,
    subject,
    html,
  });
  const testMessageUrl = nodemailer.getTestMessageUrl(info);
  console.log("Preview URL: %s", testMessageUrl);
  return testMessageUrl;
};
