import config from "../config/config.js";
import UserDto from "../dao/dto/user.js";
import sendEmail from "../services/email/index.js";
import { emailTemplates } from "../services/email/templates/index.js";
import responses, { statusTypes } from "../utils/responses.js";
import jwt from "jsonwebtoken";

const registerUser = async (req, res, next) => {
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

const loginUser = async (req, res, next) => {
  try {
    const user = new UserDto(req.user);
    const token = jwt.sign({ ...user }, config.auth.jwt_secret_key, {
      expiresIn: "1h",
    });
    responses.successResponse(res, { user, token });
  } catch (error) {
    next(error);
  }
};
const demoLoginUser = async (req, res, next) => {
  try {
    const user = new UserDto(req.user);
    const token = jwt.sign({ ...user }, config.auth.jwt_secret_key, {
      expiresIn: "1h",
    });
    responses.successResponse(res, { user, token });
  } catch (error) {
    next(error);
  }
};

const logOutUser = async (req, res, next) => {
  try {
    responses.successResponse(res, { status: statusTypes.SUCCESS, payload: "Logged out" });
  } catch (error) {
    next(error);
  }
};

const checkSession = async (req, res, next) => {
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
  demoLoginUser,
};
