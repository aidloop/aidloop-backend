

export default function AccountVerified({ name }) {
  return `
    <div>
      <h2>Your Account Has Been Verified</h2>

      <p>Hello {name},</p>

      <p>
        Congratulations! Your account has been verified by the AidLoop team.
      </p>

      <p>Thank you for being part of the community.</p>

      <p>— AidLoop Team</p>
    </div>
  `;
}