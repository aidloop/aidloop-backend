export default function VerifyEmail({ name, verifyUrl }) {
  return `
    <div>
      <h2>Verify Your AidLoop Account</h2>

      <p>Hello ${name},</p>

      <p>
        Thank you for creating an account on AidLoop.
        Please confirm your email address to activate your account.
      </p>

      <a href="${verifyUrl}" 
         style="padding:12px 20px;background:#2563eb;color:white;text-decoration:none;">
         Verify Email
      </a>

      <p>If you did not create this account, ignore this email.</p>

      <p>— AidLoop Team</p>
    </div>
  `;
}