import express from "express";
import { sendEmail } from "../services/email.service.js";

import VerifyEmail from "../emails/templates/verifyEmail.js";
import WelcomeEmail from "../emails/templates/welcomeEmail.js";
import ApplicationSuccess from "../emails/templates/applicationSuccess.js";
import EventCreated from "../emails/templates/eventCreated.js";
import AccountVerified from "../emails/templates/accountVerified.js";

const router = express.Router();

router.get("/test-emails", async (req, res) => {
  try {

    const testEmail = "your-email@gmail.com";

    await sendEmail({
      to: testEmail,
      subject: "Test Verify Email",
      template: VerifyEmail({
        name: "Test User",
        verifyUrl: "http://localhost:3000/api/auth/verify/testtoken"
      })
    });

    await sendEmail({
      to: testEmail,
      subject: "Test Welcome Email",
      template: WelcomeEmail({
        name: "Test User"
      })
    });

    await sendEmail({
      to: testEmail,
      subject: "Test Application Email",
      template: ApplicationSuccess({
        name: "Test User",
        eventTitle: "Community Cleanup",
        OrganizationName: "AidLoop Org",
        eventDate: "June 20 2026"
      })
    });

    await sendEmail({
      to: testEmail,
      subject: "Test Event Created",
      template: EventCreated({
        organizationName: "AidLoop Org",
        eventTitle: "Beach Cleanup"
      })
    });

    await sendEmail({
      to: testEmail,
      subject: "Test Account Verified",
      template: AccountVerified({
        name: "Test User"
      })
    });

    res.json({ message: "All test emails sent" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Email test failed" });
  }
});

export default router;