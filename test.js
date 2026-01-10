import nodemailer from "nodemailer";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const sendMailWithAttachment = async () => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "madhankumarraja6@gmail.com",
        pass: "bqpi mvvc uclg cfas", // ✅ App Password
      },
    });

    const mailOptions = {
      from: `"Minda System" <${process.env.GMAIL_USER}>`,
      to: "madhankumarraja6@gmail.com",
      subject: "Test Mail with Attachment (Gmail)",
      text: "Please find the attached file.",
      attachments: [
        {
          filename: "report.xlsx",
          path: path.resolve("./reports/test.xlsx"),
        },
      ],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Gmail sent successfully:", info.messageId);

  } catch (error) {
    console.error("❌ Error sending Gmail:", error);
  }
};

sendMailWithAttachment();
