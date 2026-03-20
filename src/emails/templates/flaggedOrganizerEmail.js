import emailLayout from "../components/EmailLayout.js";

export default function FlaggedOrganizerEmail({ organizationName, issues }) {
  const issuesList = issues.map(issue => `<li>${issue}</li>`).join("");
  const content = `
    <div>
      <p>Dear ${organizationName},</p>

      <p>Your organization account has been flagged for review due to repeated activity requiring attention.</p>
      <p>This follows previous warnings regarding:</p>
      <ul>${issuesList}</ul>

      <p>Please review your recent activities and correct any inaccurate or incomplete event details. Continued violations may lead to further restrictions.</p>

      <p>Thank you for being part of AidLoop.</p>
      <p>— AidLoop Team</p>
    </div>
  `;

  return emailLayout({ title: "Important Notice Regarding Your AidLoop Account", content });
}