
export default function OrganizationApproved({ organizationName }) {
  return `
    <div>
      <h2>Your Account Has Been Verified</h2>

      <p>Hello {organizationName},</p>

      <p>
       Congratulations! Your organization has been approved on AidLoop.
       You can now create events and manage volunteer participation from 
       your dashboard.
      </p>

      <p>Thank you for being part of the community.</p>

      <p>— AidLoop Team</p>
    </div>
  `;
}