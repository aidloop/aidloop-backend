import express from "express";
import { submitRating } from "../controllers/rating.controller.js";

const router = express.Router();

router.post("/ratings", submitRating)

export default router;