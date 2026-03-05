import { Resend } from "resend";
import { render } from "@react-email/render";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({ to, subject, template }) => {
  try {
    const html = template;

    const response = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });

    console.log("Email sent:", response);

    return response;
  } catch (error) {
    console.error("Email send error:", error);
    throw error;
  }
};