import express from "express";
import { verifyCertificate, downloadCertificate } from "../controllers/certificate.controller.js";

const router = express.Router();

router.get("/verify/:id", verifyCertificate);
router.get("/download/:id", downloadCertificate)

export default router;
