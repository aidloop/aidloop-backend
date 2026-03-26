import express from "express";
import {
  verifyCertificate,
  downloadCertificate,
  getMyCertificates,
  getCertificateById,
  getAllCertificates,
  getPendingCertificates,
  getCertificatesByEvent   
} from "../controllers/certificate.controller.js";

const router = express.Router();

router.get("/verify/:id", verifyCertificate);
router.get("/download/:id", downloadCertificate);
router.get("/my-certificates", getMyCertificates);

router.get("/event/:eventId", getCertificatesByEvent); 

router.get("/pending/:eventId", getPendingCertificates);

router.get("/:id", getCertificateById);
router.get("/", getAllCertificates);

export default router;
