import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import fs from "fs";
import path from "path";
import axios from "axios";
import cloudinary from "../config/cloudinary.js";

export const generateCertificate = async (
  volunteerName,
  eventTitle,
  organizerName,
  organizerLogo,
  organizerSignature,
  certificateId
) => {
  const tempFile = path.join(process.cwd(), `temp-${certificateId}.pdf`);

  let organizerLogoPath = null;
  let signaturePath = null;

  const doc = new PDFDocument({
    size: "A4",
    layout: "landscape"
  });

  doc.page.margins = { top: 0, left: 0, bottom: 0, right: 0 };

  const stream = fs.createWriteStream(tempFile);
  doc.pipe(stream);

  try {
    /* ================= ASSETS ================= */
    const template = path.join(process.cwd(), "src/assets/certificate-template.jpg");
    const aidloopLogo = path.join(process.cwd(), "src/assets/aidloop.png");
    const seal = path.join(process.cwd(), "src/assets/gold-seal.jpeg");

    doc.registerFont("titleFont", path.join(process.cwd(), "src/assets/fonts/PlayfairDisplay-Bold.ttf"));
    doc.registerFont("bodyFont", path.join(process.cwd(), "src/assets/fonts/OpenSans-VariableFont.ttf"));

    doc.image(template, 0, 0, { width: 842 });

    /* ================= LOGO BOXES ================= */
    doc.save().fillOpacity(0.95).rect(40, 30, 170, 90).fillAndStroke("#FFF", "#E5E5E5").restore();
    doc.save().fillOpacity(0.95).rect(630, 30, 170, 90).fillAndStroke("#FFF", "#E5E5E5").restore();

    /* ================= LOGOS ================= */
    doc.image(aidloopLogo, 50, 35, { fit: [160, 80] }); // bigger

    if (organizerLogo) {
      const logoTemp = path.join(process.cwd(), `temp-logo-${certificateId}.png`);

      const res = await axios({ url: organizerLogo, method: "GET", responseType: "stream" });
      const writer = fs.createWriteStream(logoTemp);

      await new Promise((resolve, reject) => {
        res.data.pipe(writer);
        writer.on("finish", resolve);
        writer.on("error", reject);
      });

      organizerLogoPath = logoTemp;

      doc.image(organizerLogoPath, 635, 35, { fit: [150, 80] }); 
    }

    /* ================= LABELS ================= */
    doc.font("bodyFont").fontSize(10).fillColor("#666")
       .text("Powered by AidLoop", 60, 115);

    doc.text("Organized by", 650, 115, {
      width: 120,
      align: "center"
    });

    doc.moveTo(40, 135)
       .lineTo(800, 135)
       .stroke("#EAEAEA");

   

    /* ================= NAME ================= */
    doc.font("titleFont")
       .fontSize(48)
       .fillColor("#C9A227")
       .text(volunteerName, 0, 260, {
         width: 842,
         align: "center",
         characterSpacing: 3
       });

    /* ================= DESCRIPTION ================= */
    doc.font("bodyFont")
       .fontSize(18)
       .fillColor("#444")
       .text(
         `In recognition of your outstanding volunteer service during`,
         0,
         340,
         { width: 842, align: "center" }
       );

    doc.moveDown(0.3);

    doc.font("bodyFont")
       .fontSize(20)
       .fillColor("#000")
       .text(`"${eventTitle}"`, {
         align: "center"
       });

    doc.moveDown(0.3);

    doc.font("bodyFont")
       .fontSize(16)
       .fillColor("#555")
       .text(`organized by ${organizerName}`, {
         align: "center"
       });

    /* ================= GOLD SEAL (CENTER FIXED) ================= */
    doc.save();
    doc.opacity(0.2);
    doc.image(seal, 355, 385, { width: 120 }); 
    doc.restore();

    /* ================= SIGNATURE (FIXED) ================= */
    if (organizerSignature) {
      const sigTemp = path.join(process.cwd(), `temp-sign-${certificateId}.png`);

      const res = await axios({ url: organizerSignature, method: "GET", responseType: "stream" });
      const writer = fs.createWriteStream(sigTemp);

      await new Promise((resolve, reject) => {
        res.data.pipe(writer);
        writer.on("finish", resolve);
        writer.on("error", reject);
      });

      signaturePath = sigTemp;

      // ONLY signature image (no extra text/line)
      doc.image(signaturePath, 520, 410, { width: 120 });
    }

    /* ================= DATE ================= */
    const date = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    doc.font("bodyFont")
       .fontSize(16)
       .fillColor("#444")
       .text(date, 160, 450);

    /* ================= QR ================= */
    const verifyUrl = `${process.env.FRONTEND_URL}/verify-certificate/${certificateId}`;
    const qr = await QRCode.toDataURL(verifyUrl);

    doc.image(qr, 720, 410, { width: 85 });

    doc.end();
    await new Promise(r => stream.on("finish", r));

    const upload = await cloudinary.uploader.upload(tempFile, {
      folder: "aidloop-certificates",
      resource_type: "raw",
      type: "upload"
    });

    return upload.secure_url;

  } finally {
    [tempFile, organizerLogoPath, signaturePath].forEach(file => {
      if (file && fs.existsSync(file)) fs.unlinkSync(file);
    });
  }
};
