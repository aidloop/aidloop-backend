import express from "express";
import { verifyCertificate, downloadCertificate,
    getMyCertificates,getCertificateById
 } from "../controllers/certificate.controller.js";
 

const router = express.Router();

router.get("/verify/:id", verifyCertificate);
router.get("/download/:id", downloadCertificate)
router.get("/my-certificates", getMyCertificates);
router.get("/:id", getCertificateById);

export default router;