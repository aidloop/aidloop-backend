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

  res.download(certificate.certificateUrl);
};