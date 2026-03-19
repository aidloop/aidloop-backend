import emailLayout from "../components/EmailLayout";

export default function AccountVerified({ name }) {
  const content= `
    <div>

      <p>Hello ${name},</p>

      <p>
        Congratulations! Your account has been verified by the AidLoop team.
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