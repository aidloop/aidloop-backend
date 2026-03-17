import {
  registerForEventService,
  cancelRegistrationService,
  getVolunteerRegistrationsService,
  getEventRegistrationsService,
  markAttendanceService
} from "../services/application.service.js";


export const registerForEvent = async (req, res) => {
  try {
    
    const { role } = req.body;
    const eventId = req.params.eventId;
    const volunteerId = req.user._id;

    if (!role || typeof role !== "string") {
      return res.status(400).json({
        message: "Role is required",
      });
    }

   
    const registration = await registerForEventService(
      eventId,
      volunteerId,
      role
    );

    res.status(201).json({
      message: "Successfully registered for event",
      registration,
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error.stack);

    res.status(400).json({
      message: error.message || "Registration failed",
    });
  }
};

export const cancelRegistration = async (req, res) => {

  try {

    const registration = await cancelRegistrationService(
      req.params.eventId,
      req.user._id
    );

    res.json({
      message: "Registration cancelled",
      registration
    });

  } catch (error) {

    res.status(400).json({
      message: error.message
    });

  }

};


export const getMyRegistrations = async (req, res) => {

  try {

    const registrations =
      await getVolunteerRegistrationsService(req.user._id);

    res.json(registrations);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};


export const getEventRegistrations = async (req, res) => {

  try {

    const registrations =
      await getEventRegistrationsService(req.params.eventId);

    res.json(registrations);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};


export const markAttendance = async (req, res) => {

  try {

    const { status } = req.body;

    const registration =
      await markAttendanceService(req.params.id, status);

    res.json({
      message: "Attendance updated",
      registration
    });

  } catch (error) {

    res.status(400).json({
      message: error.message
    });

  }

};