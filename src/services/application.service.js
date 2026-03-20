import Registration from "../models/Application.js";
import Event from "../models/Event.js";
import User from "../models/User.js";
import { sendApplicationSuccessEmail } from "./email.service.js";
import { createNotification } from "./notification.service.js";
import { generateCertificateService } from "./certificate.service.js";

export const registerForEventService = async (eventId, volunteerId, role) => {

const event = await Event.findById(eventId);

if (!event) {
  throw new Error("Event not found");
}

if (!role || typeof role !== "string") {
  throw new Error("Role is required");
}

const normalizedRole = role.trim().toLowerCase();

const validRoles = (event.roles || [])
  .filter(r => typeof r === "string" && r.trim() !== "")
  .map(r => r.trim().toLowerCase());

if (!validRoles.includes(normalizedRole)) {

  throw new Error("Invalid role selected");
}
  const existingRegistration = await Registration.findOne({
    eventId,
    volunteerId,
    
  });

  if (existingRegistration) {
    throw new Error("Already registered for this event");
  }

  const count = await Registration.countDocuments({
  eventId,
  status: "registered"
});

if (count >= event.volunteerSlots) {
  throw new Error("Event is full");
}
const volunteer = await User.findById(volunteerId);
const organizer = await User.findById(event.organizationId);


const registration = await Registration.create({
  eventId,
  volunteerId,
  role,
  status: "registered"
});


await Event.findByIdAndUpdate(eventId, {
  $inc: { registeredCount: 1 }
});

await createNotification({
  userId: volunteer._id,
  title: "Registration Confirmed",
  message: `You registered for ${event.name}`,
  type: "registration",
  data: { eventId: event._id }
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

if (registration.status === "registered") {
  await Event.findByIdAndUpdate(eventId, {
    $inc: { registeredCount: -1 }
  });
}
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

  await registration.save();

  if (status === "attended") {
    await generateCertificateService(registration._id);
  }

  return registration;
};