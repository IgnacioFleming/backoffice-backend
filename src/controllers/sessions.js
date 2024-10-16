import UserDto from "../dao/dto/user.js";
import sendEmail from "../services/email/index.js";
import { emailTemplates } from "../services/email/templates/registerEmail.js";

const registerUser = async (req, res) => {
  const user = new UserDto(req.user);
  const destinationEmail = "ignacioflemings@gmail.com";
  const subject = "¡Bienvenido a Business Manager!";
  const emailHtmlBody = emailTemplates.registerEmailTemplate(`${user.first_name} ${user.last_name}`);
  await sendEmail(destinationEmail, subject, emailHtmlBody);
  res.send({ status: "success", payload: user });
};

const loginUser = async (req, res) => {
  const user = new UserDto(req.user);
  res.send({ status: "success", payload: user });
};

export default {
  registerUser,
  loginUser,
};
