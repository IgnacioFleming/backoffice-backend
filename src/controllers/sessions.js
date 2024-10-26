import UserDto from "../dao/dto/user.js";
import sendEmail from "../services/email/index.js";
import { emailTemplates } from "../services/email/templates/index.js";

const registerUser = async (req, res) => {
  const user = new UserDto(req.user);
  const destinationEmail = user.email;
  const subject = "¡Bienvenido a Business Manager!";
  const emailHtmlBody = emailTemplates.registerEmailTemplate(`${user.first_name} ${user.last_name}`);
  await sendEmail(destinationEmail, subject, emailHtmlBody);
  res.send({ status: "success", payload: user });
};

const loginUser = async (req, res) => {
  const user = new UserDto(req.user);
  res.send({ status: "success", payload: user });
};

const logOutUser = async (req, res) => {
  req.session.destroy();
  res.json({ status: "success", payload: "Logged out." });
};

const checkSession = async (req, res) => {
  const user = new UserDto(req.user);
  res.json({ status: "success", payload: user, message: "You are logged in." });
};

export default {
  registerUser,
  loginUser,
  logOutUser,
  checkSession,
};
