
import emailLayout from "../components/EmailLayout.js";

export default function OrganizerWelcome({ fullName }) {
  const content = `
    <div>
      <h2>${fullName}</h2>

      <p>Thank you for registering as an organizer.</p>

      <p>
        Your organization account is currently under review by our team.
        Once approved, you will be able to:
      </p>

      <ul>
        <li>Create volunteer events</li>
        <li>Manage volunteer registrations</li>
        <li>Track attendance and engagement</li>
      </ul>

      <p>
        You will receive another email once your organization has been approved.
      </p>

      <p>— The AidLoop Team</p>
    </div>
  `;
   return emailLayout({
    title: "Welcome to AidLoop 🌍",
    content
  });
}