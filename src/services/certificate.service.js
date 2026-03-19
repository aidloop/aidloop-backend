import Certificate from "../models/Certificate.js";
import Registration from "../models/Application.js";
import { generateCertificate } from "../utils/certificateGenerator.js";

export const generateCertificateService = async (registrationId) => {

  const registration = await Registration
    .findById(registrationId)
    .populate("volunteerId")
    .populate({
      path: "eventId",
      populate: {
        path: "organizationId"
      }
    });

  if (!registration) {
    throw new Error("Registration not found");
  }

  const organizer = registration.eventId.organizationId;
  console.log(organizer);
  if (!organizer) {
    throw new Error("Organizer not found");
  }

  /* CREATE CERTIFICATE */
  const certificate = await Certificate.create({
    volunteerId: registration.volunteerId._id,
    eventId: registration.eventId._id,
    registrationId
  });

  /*GENERATE CERTIFICATE */
  const url = await generateCertificate(
    registration.volunteerId.fullName,
    registration.eventId.name,
    organizer.fullName,
    organizer.profileImage, //THIS is the logo
    organizer.signatureImage,
    certificate._id
  );

  certificate.certificateUrl = url;

  await certificate.save();

  return certificate;
};
