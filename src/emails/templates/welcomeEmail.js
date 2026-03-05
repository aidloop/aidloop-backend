

export default function WelcomeEmail({ name }) {
  return `
    <div>
      <h2>Welcome to AidLoop 🌍</h2>

      <p>Hello {name},</p>

      <p>
        Your email has been successfully verified.
      </p>

      <p>
        Your account has been successfully created. AidLoop connects you with verified volunteer
        opportunities and trusted organizations within your community.
        You can now browse events, register for volunteer opportunities, and begin making meaningful
        impact.
      </p>
      
      <p>— AidLoop Team</p>
    </div>
  `
}