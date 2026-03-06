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
  const verificationUrl = `http://10.75.73.4:3000/api/auth/verify/${token}`;
  

  await transporter.sendMail({
    from: `"AidLoop" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Verify Your Email",
    html: ` <div>
      <h2>Verify Your AidLoop Account</h2>

      <p>Hello  Emmanuel Ochala, </p>

      <p>
        Thank you for creating an account on AidLoop.
        Please confirm your email address to activate your account.
      </p>

      <a href="${verificationUrl}" 
         style="padding:12px 20px;background:#2563eb;color:white;text-decoration:none;">
         Verify Email
      </a>

      <p>If you did not create this account, ignore this email.</p>

      <p>— AidLoop Team</p>
    </div>`,
  });
};