
import express from "express";
import upload from "../middleware/upload.middleware.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

router.post("/event-image", upload.single("image"), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Convert buffer → base64
    const base64 = file.buffer.toString("base64");
    const dataURI = `data:${file.mimetype};base64,${base64}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "aidloop/events",
    });

    res.status(200).json({
      imageUrl: result.secure_url,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Upload failed" });
  }
});

export default router;