import emailLayout from "../components/EmailLayout.js";

export default function WarningEmail({ organizationName, issues }) {
  const issuesList = issues.map(issue => `<li>${issue}</li>`).join("");
  const content = `
    <div>
      <p>Dear ${organizationName},</p>

      <p>This is to notify you of activity on your AidLoop account that requires improvement:</p>
      <ul>${issuesList}</ul>

      <p>Please take the following steps:</p>
      <ul>
        <li>Review your recent and upcoming events</li>
        <li>Ensure all event details are accurate and complete</li>
        <li>Maintain consistency in event execution</li>
      </ul>

      <p>Continued occurrences may lead to further action, including account review.</p>

      <p>Thank you for your cooperation.</p>
      <p>— AidLoop Team</p>
    </div>
  `;

  return emailLayout({ title: "Notice Regarding Your Activity on AidLoop", content });
}