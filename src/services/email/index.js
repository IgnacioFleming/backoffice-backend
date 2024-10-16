import nodemailer from "nodemailer";
import config from "../../config/config.js";

const gmailTransporter = nodemailer.createTransport({
  service: "Gmail",
  port: 587,
  auth: {
    user: config.email_service.user,
    pass: config.email_service.password,
  },
});

const sendEmail = async (to, subject, html) => {
  gmailTransporter.sendMail({ from: config.email_service.user, to, subject, html });
};

export default sendEmail;
