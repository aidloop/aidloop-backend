import emailLayout from "../components/EmailLayout.js";
export default function EventCreated({ organizationName, eventName }) {
  const content = `
    <div>
      
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
   return emailLayout({
    title: "Event Created Successfully",
    content
  });
}