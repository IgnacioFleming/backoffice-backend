import { ERRORS } from "./errorTypes.js";

export default class CustomError extends Error {
  constructor(name, message, statusCode) {
    super(message);
    this.name = name || ERRORS.UNHANDLED.name;
    this.statusCode = statusCode || 500;
    Error.captureStackTrace(this, this.constructor);
  }
}
