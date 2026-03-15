import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import fs from "fs";
import path from "path";
import cloudinary from "../config/cloudinary.js";

export const generateCertificate = async (
  volunteerName,
  eventTitle,
  organizerName,
  certificateId
) => {

  const tempFile = path.join(
  process.cwd(),
  `temp-${certificateId}.pdf`
);

  const doc = new PDFDocument({
  size: "A4",
  layout: "landscape",
  autoFirstPage: true
});
doc.page.margins = { top:0, left:0, bottom:0, right:0 };

  const stream = fs.createWriteStream(tempFile);

  doc.pipe(stream);

  const template = path.join(
    process.cwd(),
    "src/assets/certificate-template.jpg"
  );

  doc.registerFont(
  "titleFont",
  path.join(process.cwd(), "src/assets/fonts/PlayfairDisplay-Bold.ttf")
);

doc.registerFont(
  "bodyFont",
  path.join(process.cwd(), "src/assets/fonts/Montserrat-Regular.otf")
);

  doc.image(template, 0, 0, {
    width: 842
  });

 // Volunteer Name
doc.font("titleFont")
   .fontSize(44)
   .fillColor("#C9A227")
   .text(volunteerName, 0, 250, {
     width: 842,
     align: "center",
     characterSpacing:2
   });


// Description
doc.font("bodyFont")
   .fontSize(20)
   .fillColor("#333333")
  .text(
  `In recognition of your participation in "${eventTitle}" organized by ${organizerName} through the AidLoop platform.`,
  121,
  330,
  {
    width: 600,
    align: "center",
    lineGap: 6,
    lineBreak:false,
    characterSpacing:0.5
  }
);

 const date = new Date().toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric"
});

doc.font("bodyFont")
   .fontSize(16)
   .fillColor("#444")
   .text(date, 160, 450, {
     width: 842,
    
   });
//    const signature = path.join(
//   process.cwd(),
//   "src/assets/signature.png"
// );

// doc.image(signature, 540, 400, { width: 120 });

// doc.font("bodyFont")
//    .fontSize(14)
//    .text("AidLoop Director", 520, 440);

 const verifyUrl =
  `${process.env.FRONTEND_URL}/verify-certificate/${certificateId}`;

const qr = await QRCode.toDataURL(verifyUrl);

const qrX = 720;
const qrY = 410;
const qrSize = 85;

// QR image
doc.image(qr, qrX, qrY, { width: qrSize });

// certificate ID
doc.font("bodyFont")
   .fontSize(9)
   .fillColor("#888")
   .text(`ID: ${certificateId}`, qrX, qrY - 15);

// label under QR
doc.font("bodyFont")
   .fontSize(10)
   .fillColor("#666")
   .text(
     "Verify Certificate",
     qrX - 5,
     qrY + qrSize + 8,
     {
       width: qrSize + 20,
       align: "center",
       lineBreak: false
     }
   );
  doc.end();

  await new Promise(resolve => stream.on("finish", resolve));

 

  // Upload to Cloudinary


let upload;

try {

  upload = await cloudinary.uploader.upload(tempFile, {
    folder: "aidloop-certificates",
    resource_type: "raw"
  });

} finally {

  if (fs.existsSync(tempFile)) {
    fs.unlinkSync(tempFile);
  }

}

  return upload.secure_url;
};