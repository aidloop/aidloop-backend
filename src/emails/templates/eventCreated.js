
export default function EventCreated({ organizationName, eventName }) {
  return `
    <div>
      <h2>Event Created Successfully</h2>

      <p>Hello ${organizationName},</p>

      <p>Your event:</p>

      <h3>${eventName}</h3>

      <p>has been successfully created on AidLoop.</p>

      <p>
        It will be reviewed by our team before it becomes publicly visible.
      </p>
      <p>Volunteers Will be able to view the event and begin registering
         after approval.
         </p>
      <p>You can manage volunteer registrations from your organizer dashboard</p>

      <p>— AidLoop Team</p>
    </div>
  `;
}