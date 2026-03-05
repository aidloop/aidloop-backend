

export default function OrganizationRejected({ organizationName }) {
  return `
    <div>
      <h2>Your Account Has Been Verified</h2>

      <p>Hello {organizationName},</p>

      <p>
       Your organization verification request was not approved.
       Please review the submitted information and resubmit if necessary
      </p>

      <p>— AidLoop Team</p>
    </div>
  `;
}