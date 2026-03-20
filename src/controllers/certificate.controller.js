import Certificate from "../models/Certificate.js";

export const verifyCertificate = async (req, res) => {

  const certificate = await Certificate
    .findById(req.params.id)
    .populate("volunteerId")
    .populate("eventId");

  if (!certificate) {
    return res.status(404).json({
      message: "Certificate not found"
    });
  }

  res.json({
    volunteer: certificate.volunteerId.fullName,
    event: certificate.eventId.name,
    issuedAt: certificate.issuedAt
  });
};

export const downloadCertificate = async (req, res) => {
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