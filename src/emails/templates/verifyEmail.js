import emailLayout from "../components/EmailLayout.js";

export default function VerifyEmail({ fullName, verifyUrl }) {

  const content = `
    <p>Hello ${fullName},</p>

    <p>
      Thank you for creating an account on AidLoop.
      Please confirm your email address to activate your account.
    </p>

    <a href="${verifyUrl}" 
       style="display:inline-block;padding:12px 20px;background:#2563eb;color:white;text-decoration:none;border-radius:5px;margin-top:10px;">
       Verify Email
    </a>

    <p style="margin-top:20px;">
      If you did not create this account, ignore this email.
    </p>
  `;

  return emailLayout({
    title: "Verify Your AidLoop Account",
    content
  });
}