import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendWelcomeEmail = async (to, name) => {
  await transporter.sendMail({
    from: `"AidLoop" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Welcome to AidLoop",
    html: `<h2>Welcome ${name}!</h2>
           <p>Your account has been created.</p>`,
  });
};

export const sendVerificationEmail = async (to, token) => {
  const verificationUrl = `http://10.55.79.4:3000/api/auth/verify/${token}`;

  await transporter.sendMail({
    from: `"AidLoop" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Verify Your Email",
    html: `<p>Click below to verify your account:</p>
           <a href="${verificationUrl}">Verify Email</a>`,
  });
};