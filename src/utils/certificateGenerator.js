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
    // const seal = path.join(process.cwd(), "src/assets/gold-seal.jpeg");

    doc.registerFont("titleFont", path.join(process.cwd(), "src/assets/fonts/PlayfairDisplay-Bold.ttf"));
    doc.registerFont("bodyFont", path.join(process.cwd(), "src/assets/fonts/OpenSans-VariableFont.ttf"));

    doc.image(template, 0, 0, { width: 842 });

    /* ================= LOGO BOXES ================= */
    doc.save().fillOpacity(0.95).rect(40, 30, 170, 90).fillAndStroke("#FFF", "#E5E5E5").restore();
    doc.save().fillOpacity(0.95).rect(630, 30, 170, 90).fillAndStroke("#FFF", "#E5E5E5").restore();

    /* ================= LOGOS ================= */
    doc.image(aidloopLogo, 60, 40, { fit: [140, 70] });

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

      doc.image(organizerLogoPath, 645, 40, { fit: [120, 70] });

    } else {
      doc.font("bodyFont").fontSize(12).text(organizerName, 640, 60, {
        width: 140,
        align: "center"
      });
    }

    /* ================= LABELS ================= */
    doc.font("bodyFont").fontSize(10).fillColor("#666")
       .text("Powered by AidLoop", 60, 115);

    doc.text("Organized by", 640, 115, {
      width: 140,
      align: "center"
    });

    doc.moveTo(40, 125).lineTo(800, 125).stroke("#EAEAEA");

    /* ================= TITLE ================= */
    doc.font("titleFont")
      .fontSize(30)
      .text("CERTIFICATE OF APPRECIATION", 0, 170, {
        width: 842,
        align: "center"
      });

    /* ================= NAME ================= */
    doc.font("titleFont")
      .fontSize(44)
      .fillColor("#C9A227")
      .text(volunteerName, 0, 250, {
        width: 842,
        align: "center"
      });

    /* ================= DESCRIPTION ================= */
    doc.font("bodyFont")
      .fontSize(17)
      .fillColor("#333")
      .text(
        `In recognition of your outstanding volunteer service during "${eventTitle}" organized by ${organizerName} through the AidLoop platform.`,
        121,
        330,
        { width: 600, align: "center" }
      );

    /* ================= GOLD SEAL ================= */
    // doc.save();
    // doc.opacity(0.25);
    // doc.image(seal, 360, 360, { width: 120 });
    // doc.restore();

    /* ================= SIGNATURE ================= */
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

      doc.image(signaturePath, 520, 400, { width: 120 });

      doc.font("bodyFont")
        .fontSize(12)
        .fillColor("#000")
        .text(organizerName, 520, 440);
    }

    /* ================= DATE ================= */
    const date = new Date().toDateString();

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
      resource_type: "raw"
    });

    return upload.secure_url;

  } finally {
    [tempFile, organizerLogoPath, signaturePath].forEach(file => {
      if (file && fs.existsSync(file)) fs.unlinkSync(file);
    });
  }
};
