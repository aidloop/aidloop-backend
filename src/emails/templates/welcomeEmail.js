import emailLayout from "../components/EmailLayout.js";

export default function WelcomeEmail({ name }) {
  const content = `
    <div>

      <p>Hello ${name},</p>

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
   return emailLayout({
    title: "Welcome to AidLoop 🌍",
    content
  });
}