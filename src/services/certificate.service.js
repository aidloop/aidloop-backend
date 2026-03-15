import Certificate from "../models/Certificate.js";
import Registration from "../models/Application.js"
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

  const certificate = await Certificate.create({
    volunteerId: registration.volunteerId._id,
    eventId: registration.eventId._id,
    registrationId
  });

  const url = await generateCertificate(
    registration.volunteerId.fullName,
    registration.eventId.name,
    registration.eventId.organizationId.fullName,
    certificate._id
  );

  certificate.certificateUrl = url;

  await certificate.save();

  return certificate;
};