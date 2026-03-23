import { Resend } from "resend";
import VerifyEmail from "../emails/templates/verifyEmail.js";
import WelcomeEmail from "../emails/templates/welcomeEmail.js";
import ApplicationSuccess from "../emails/templates/applicationSuccess.js";
import EventCreated from "../emails/templates/eventCreated.js";
import OrganizationApproved from "../emails/templates/organizationApproval.js";
import OrganizationRejected from "../emails/templates/organizationRejected.js";
import OtpEmail from "../emails/templates/otpVerification.js";
import OrganizerWelcome from "../emails/templates/organizerWelcome.js";
import WarningEmail from "../emails/templates/warningEmail.js";
import FlaggedOrganizerEmail from "../emails/templates/flaggedOrganizerEmail.js";
import EventCancellationVolunteerEmail from "../emails/templates/eventCancellationVolunteerEmail.js";




const resend = new Resend(process.env.RESEND_API_KEY);

/* -------------------------------- */
/* GENERIC EMAIL SENDER */
/* -------------------------------- */

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const response = await resend.emails.send({
      from: `AidLoop <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent:", response);
  } catch (error) {
    console.error("Email send error:", error);
  }
};
/* -------------------------------- */
/* EMAIL FUNCTIONS */
/* -------------------------------- */

export const sendVerificationEmail = async (to, fullName, token) => {
  const verifyUrl = `${process.env.FRONTEND_URL}/api/auth/verify/${token}`;

  const html = VerifyEmail({
    fullName,
    verifyUrl,
  });

  await sendEmail({
    to,
    subject: "Verify your AidLoop account",
    html,
  });
};

export const sendWelcomeEmail = async (to, fullName) => {
  const html = WelcomeEmail({ fullName });

  await sendEmail({
    to,
    subject: "Welcome to AidLoop",
    html,
  });
};

export const sendApplicationSuccessEmail = async (
  to,
  fullName,
  eventName,
  organizationName,
  eventDate
) => {
  const html = ApplicationSuccess({
    fullName,
    eventName,
    organizationName,
    eventDate,
  });

  await sendEmail({
    to,
    subject: "Application received",
    html,
  });
};

export const sendEventCreatedEmail = async (
  to,
  organizationName,
  eventName
) => {
  const html = EventCreated({
    organizationName,
    eventName,
  });

  await sendEmail({
    to,
    subject: "Event created successfully",
    html,
  });
};

export const sendOrganizationApprovedEmail = async (
  to,
  organizationName
) => {
  const html = OrganizationApproved({ organizationName });

  await sendEmail({
    to,
    subject: "Organization approved",
    html,
  });
};

export const sendOrganizationRejectedEmail = async (
  to,
  organizationName
) => {
  const html = OrganizationRejected({ organizationName });

  await sendEmail({
    to,
    subject: "Organization verification update",
    html,
  });
};



export const sendOtpEmail = async (to, fullName, otp) => {

  const html = OtpEmail({
    fullName,
    otp
  });

  await sendEmail({
    to,
    subject: "Your AidLoop verification code",
    html
  });
};

export const sendOrganizerWelcomeEmail = async (to, fullName) => {

  const html = OrganizerWelcome({
    fullName
  });

  await sendEmail({
    to,
    subject: "Welcome to AidLoop – Organizer Registration Received",
    html
  });
};

export const sendWarningEmail = async (to, organizationName, issues) => {
  const html = WarningEmail({ organizationName, issues });

  await sendEmail({
    to,
    subject: "Notice Regarding Your Activity on AidLoop",
    html,
  });
};

export const sendFlaggedOrganizerEmail = async (to, organizationName, issues) => {
  const html = FlaggedOrganizerEmail({ organizationName, issues });

  await sendEmail({
    to,
    subject: "Important Notice Regarding Your AidLoop Account",
    html,
  });
};

export const sendEventCancellationVolunteerEmail = async (to, volunteerName, eventName, organizationName, eventDate, reason) => {
  const html = EventCancellationVolunteerEmail({ volunteerName, eventName, organizationName, eventDate, reason });

  await sendEmail({
    to,
    subject: `Event Cancellation Notice – ${eventName}`,
    html,
  });
};
