import emailLayout from "../components/EmailLayout.js";

export default function OtpEmail({ fullName, otp }) {

  const content = `
    <p>Hello ${fullName},</p>

    <p>Your AidLoop verification code is:</p>

    <h1 style="letter-spacing:5px;font-size:32px;color:#2563eb">
      ${otp}
    </h1>

    <p>This code will expire in 10 minutes.</p>

    <p>If you did not create this account, ignore this email.</p>
  `;

  return emailLayout({
    title: "Verify your AidLoop account",
    content
  });
}