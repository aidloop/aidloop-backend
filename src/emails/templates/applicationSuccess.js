
export default function ApplicationSuccess({ fullName, eventName, OrganizationName, eventDate}) {
  return `
    <div>
      <h2>Application Received</h2>

      <p>Hello ${fullName},</p>

      <p>
       You have successfully registered for an event on AidLoop
      </p>

      <h3>${eventName}</h3>

      <h4>${OrganizationName}</h4>

      <p><strong>Date:</strong> ${eventDate}</p>

      <p>
        The organizer will review your application soon.
      </p>
    <p> You will receive updates from the event organizer if there are any changes or additional
        instructions.</p>

      <p>— AidLoop Team</p>
    </div>
   `;
}