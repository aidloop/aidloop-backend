import emailLayout from "../components/EmailLayout.js";
export default function OrganizationApproved({ organizationName }) {
  const content= `
    <div>

      <p>Hello ${organizationName},</p>

      <p>
       Congratulations! Your organization has been approved on AidLoop.
       You can now create events and manage volunteer participation from 
       your dashboard.
      </p>

      <p>Thank you for being part of the community.</p>

      <p>— AidLoop Team</p>
    </div>
  `;
   return emailLayout({
    title: "Your Account Has Been Verified",
    content
  });
}