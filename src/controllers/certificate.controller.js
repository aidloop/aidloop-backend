import Certificate from "../models/Certificate.js";
import Event from "../models/Event.js";

export const verifyCertificate = async (req, res) => {
  try {
    const certificate = await Certificate
      .findById(req.params.id)
      .populate("volunteerId", "fullName phoneNumber")
      .populate({
        path: "eventId",
        select: "name date organizationId",
        populate: {
          path: "organizationId",
          select: "fullName"
        }
      });

    if (!certificate) {
      return res.status(404).json({
        message: "Certificate not found"
      });
    }

    res.json({
      volunteerName: certificate.volunteerId?.fullName,
      phoneNumber: certificate.volunteerId?.phoneNumber,
      eventName: certificate.eventId?.name,
      organizerName: certificate.eventId?.organizationId?.fullName,
      eventDate: certificate.eventId?.date,
      issuedAt: certificate.issuedAt,
      status: "issued"
    });

  } catch (error) {
    console.error("Verify certificate error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const downloadCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);

    if (!certificate) {
      return res.status(404).json({
        message: "Certificate not found"
      });
    }

    if (
      certificate.volunteerId.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Unauthorized"
      });
    }

    return res.redirect(certificate.certificateUrl);

  } catch (error) {
    console.error("Download certificate error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getCertificateById = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);

    if (!certificate) {
      return res.status(404).json({
        message: "Certificate not found"
      });
    }

    if (certificate.volunteerId.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized"
      });
    }

    res.json(certificate);

  } catch (error) {
    console.error("Get certificate error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyCertificates = async (req, res) => {
  try {
    const certificates = await Certificate
      .find({ volunteerId: req.user.id })
      .populate("eventId", "name date")
      .sort({ createdAt: -1 });

    const formatted = certificates.map(cert => ({
      _id: cert._id,
      eventName: cert.eventId?.name,
      eventDate: cert.eventId?.date,
      issuedAt: cert.issuedAt,
      status: "issued"
    }));

    res.json(formatted);

  } catch (error) {
    console.error("My certificates error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllCertificates = async (req, res) => {
  try {
    const certificates = await Certificate
      .find()
      .populate("volunteerId", "fullName phoneNumber")
      .populate({
        path: "eventId",
        select: "name date organizationId",
        populate: {
          path: "organizationId",
          select: "fullName"
        }
      })
      .sort({ createdAt: -1 });

    const formatted = certificates.map(cert => ({
      _id: cert._id,
      volunteerName: cert.volunteerId?.fullName,
      phoneNumber: cert.volunteerId?.phoneNumber,
      eventName: cert.eventId?.name,
      organizerName: cert.eventId?.organizationId?.fullName,
      eventDate: cert.eventId?.date,
      issuedAt: cert.issuedAt,
      status: "issued"
    }));

    res.json(formatted);

  } catch (error) {
    console.error("All certificates error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPendingCertificates = async (req, res) => {
  try {

    const { eventId } = req.params;

    const pending =
      await getPendingCertificatesService(eventId);

    res.json({
      success: true,
      data: pending
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

    export const getCertificatesByEvent = async (req, res) => {
  try {

    const certificates = await Certificate.find({
      eventId: req.params.eventId
    })
    .populate("volunteerId", "fullName email profileImage")
    .populate("eventId", "name date");

    res.json({
      success: true,
      data: certificates
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

  }
};
