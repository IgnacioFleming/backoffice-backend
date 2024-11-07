import UserDto from "../dao/dto/user.js";
import sendEmail from "../services/email/index.js";
import { emailTemplates } from "../services/email/templates/index.js";
import responses from "../utils/responses.js";

const registerUser = async (req, res) => {
  try {
    const user = new UserDto(req.user);
    const destinationEmail = user.email;
    const subject = "¡Bienvenido a Business Manager!";
    const emailHtmlBody = emailTemplates.registerEmailTemplate(`${user.first_name} ${user.last_name}`);
    await sendEmail(destinationEmail, subject, emailHtmlBody);
    responses.successResponse(res, user);
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res) => {
  try {
    const user = new UserDto(req.user);
    responses.successResponse(res, user);
  } catch (error) {
    next(error);
  }
};

const logOutUser = async (req, res) => {
  try {
    req.session.destroy();
    responses.successResponse(res, "Logged out.");
  } catch (error) {
    next(error);
  }
};

const checkSession = async (req, res) => {
  try {
    const user = new UserDto(req.user);
    responses.successResponse(res, user);
  } catch (error) {
    next(error);
  }
};

export default {
  registerUser,
  loginUser,
  logOutUser,
  checkSession,
};
