import Registration from "../models/Application.js";
import Event from "../models/Event.js";
import User from "../models/User.js";
import { sendApplicationSuccessEmail } from "./email.service.js";
import { generateCertificateService } from "../services/certificate.service.js";

export const registerForEventService = async (eventId, volunteerId) => {

 const event = await Event.findById(eventId);

if (!event) {
  throw new Error("Event not found");
}

if (event.status !== "published") {
  throw new Error("Event is not open for registration");
}

  const existingRegistration = await Registration.findOne({
    eventId,
    volunteerId
  });

  if (existingRegistration) {
    throw new Error("Already registered for this event");
  }

  if (event.capacity && event.registeredCount >= event.capacity) {
    throw new Error("Event is full");
  }
const volunteer = await User.findById(volunteerId);
const organizer = await User.findById(event.organizationId);
  const registration = await Registration.create({
    eventId,
    volunteerId
  });

   await sendApplicationSuccessEmail(
    volunteer.email,
    volunteer.fullName,
    event.name,
    organizer.fullName,   // organization name
    event.date
  );


  return registration;
};


export const cancelRegistrationService = async (eventId, volunteerId) => {

  const registration = await Registration.findOne({
    eventId,
    volunteerId
  });

  if (!registration) {
    throw new Error("Registration not found");
  }

  registration.status = "cancelled";

  await registration.save();

  return registration;
};


export const getVolunteerRegistrationsService = async (volunteerId) => {

  return Registration.find({ volunteerId })
    .populate("eventId");
};


export const getEventRegistrationsService = async (eventId) => {

  return Registration.find({ eventId })
    .populate("volunteerId", "fullName email profileImage");
};


export const markAttendanceService = async (registrationId, status) => {

  const registration = await Registration.findById(registrationId);

  if (!registration) {
    throw new Error("Registration not found");
  }

  registration.status = status;
await generateCertificateService(registration._id);
  await registration.save();

  return registration;
};