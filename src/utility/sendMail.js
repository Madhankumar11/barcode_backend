import nodemailer from "nodemailer";

export const sendMailWithAttachment = async ({
  to,
  subject,
  text,
  attachmentPath
}) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,          // smtp.office365.com
      port: Number(process.env.MAIL_PORT), // 587
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // 🔍 VERIFY SMTP CONNECTION
    await transporter.verify();
    console.log("✅ SMTP connection verified");

    const info = await transporter.sendMail({
      from: `"Reports" <${process.env.MAIL_USER}>`,
      to,
      subject,
      text,
      attachments: attachmentPath
        ? [{
            filename: attachmentPath.split("/").pop(),
            path: attachmentPath
          }]
        : []
    });

    // 🔍 LOG SMTP RESPONSE
    console.log("📧 Mail sent:", info);

    return {
      status: "success",
      message: "Email sent",
      messageId: info.messageId,
      response: info.response
    };

  } catch (error) {
    console.error("❌ Mail error:", error);

    return {
      status: "error",
      message: error.message
    };
  }
};
