import express from "express";
import { createCertificate } from "../controllers/certificate.controller.js";

const router = express.Router()

router.post("/generate", createCertificate)
export default router