import emailLayout from "../components/EmailLayout.js";

export default function EventCancellationVolunteerEmail({ volunteerName, eventName, organizationName, eventDate, reason }) {
  const content = `
    <div>
      <p>Dear ${volunteerName},</p>

      <p>This is to inform you that the event you registered for has been cancelled.</p>

      <h3>Event Details:</h3>
      <ul>
        <li><strong>Event Name:</strong> ${eventName}</li>
        <li><strong>Organizer:</strong> ${organizationName}</li>
        <li><strong>Date:</strong> ${eventDate}</li>
      </ul>

      <p><strong>Reason for Cancellation:</strong> ${reason}</p>

      <p>We apologize for any inconvenience. You may continue to explore other events on AidLoop.</p>

      <p>— AidLoop Team</p>
    </div>
  `;

  return emailLayout({ title: `Event Cancellation Notice – ${eventName}`, content });
}