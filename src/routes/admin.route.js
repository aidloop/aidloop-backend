import express from "express";
import { verifyOrganizer } from "../controllers/auth.controller";


const router = express.Router();

router.patch("/organizers/:id/verify", verifyOrganizer)

export default router;