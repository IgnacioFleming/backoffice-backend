import CustomError from "./customError.js";

export const createCustomError = (error_type, message, statusCode) => {
  let parsedMessage = typeof message === "object" ? JSON.stringify(message, null, 2) : message;
  const error = new CustomError(error_type.name, parsedMessage || error_type.defaultMessage, statusCode || error_type.defaultStatusCode);
  return error;
};
