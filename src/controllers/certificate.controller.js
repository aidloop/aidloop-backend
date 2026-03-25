import Certificate from "../models/Certificate.js";

export const verifyCertificate = async (req, res) => {
  const certificate = await Certificate
    .findById(req.params.id)
    .populate({
      path: "volunteerId",
      select: "fullName phoneNumber email"
    })
    .populate({
      path: "eventId",
      select: "name date organizer",
      populate: {
        path: "organizer",
        select: "organizationName fullName"
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
    organizerName:
      certificate.eventId?.organizer?.organizationName ||
      certificate.eventId?.organizer?.fullName,
    eventDate: certificate.eventId?.date,
    issuedAt: certificate.issuedAt,
    status: "issued"
  });
};

export const downloadCertificate = async (req, res) => {
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
};


export const getCertificateById = async (req, res) => {
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
};

export const getMyCertificates = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Unauthorized"
    });
  }

  const certificates = await Certificate
    .find({ volunteerId: req.user.id })
    .sort({ createdAt: -1 });

  res.json(certificates);
};

export const getAllCertificates = async (req, res) => {
  const certificates = await Certificate
    .find()
    .populate("volunteerId", "fullName phoneNumber")
    .populate({
      path: "eventId",
      select: "name date organizer",
      populate: {
        path: "organizer",
        select: "organizationName fullName"
      }
    })
    .sort({ createdAt: -1 });

  res.json(certificates);
};
