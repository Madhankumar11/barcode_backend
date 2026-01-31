import nodemailer from "nodemailer";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const sendMailWithAttachment = async () => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.unominda.com",
      port: 465,
      secure: true, // ✅ must be true for port 465
      auth: {
        user: process.env.SMTP_USER, // e.g. no-reply@unominda.com
        pass: process.env.SMTP_PASS, // email password
      },
    });

    const mailOptions = {
      from: `"Minda System" <${process.env.SMTP_USER}>`,
      to: "receiver@email.com",
      subject: "Test Mail with Attachment (SMTP)",
      text: "Please find the attached file.",
      attachments: [
        {
          filename: "report.xlsx",
          path: path.resolve("./reports/test.xlsx"),
        },
      ],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Mail sent successfully:", info.messageId);

  } catch (error) {
    console.error("❌ Error sending mail:", error);
  }
};

sendMailWithAttachment();
