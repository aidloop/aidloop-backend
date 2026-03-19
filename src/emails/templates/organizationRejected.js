import emailLayout from "../components/EmailLayout.js";

export default function OrganizationRejected({ organizationName }) {
  const content= `
    <div>

      <p>Hello ${organizationName},</p>

      <p>
       Your organization verification request was not approved.
       Please review the submitted information and resubmit if necessary
      </p>

      <p>— AidLoop Team</p>
    </div>
  `;
   return emailLayout({
    title: "Your Account Has Been Verified",
    content
  });
}