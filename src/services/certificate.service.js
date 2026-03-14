import certificateModel from "../models/certificate.model";
import Event from "../event"
import Apllication from "/models/application.models.js"

export const generateCertificate = async (userId, eventId) => {
    const event = await Event.findById(eventId)
    if (!event || event.status !== "completed") {
        throw new Error("Event not completed");
    }

    const application = await application.findOne({
        user: userId,
        event: eventId,
        status: "approved"
    })
    if (!application) {
        throw new Error("Volunteer not approved");
    }

    const existing = await Certificate.findOne({
        user: userId,
        event: eventId
    })
    if (existing) {
        throw new Error("Certificate already generated");
    }

    const certificateNumber = "CERT-" + Date.now()

    const certificate = await Certificate.create({
        user: userId,
        event: eventId,
        certificateNumber
    })
    return certificate
}