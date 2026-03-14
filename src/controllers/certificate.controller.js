import { generateCertificate } from "../services/certificate.service.js";
export const createCertificate = async (req, res) => {
    try {
        const { userId, eventId } = req.body
        const certificate = await generateCertificate(userId, eventId)
        res.status(201).json({
            message: "Certificate generated",
            certificate
        })
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}