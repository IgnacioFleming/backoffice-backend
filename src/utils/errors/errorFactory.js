import CustomError from "./customError.js";

export const createCustomError = (error_type, message, statusCode) => {
  const error = new CustomError(error_type.name, message || error_type.defaultMessage, statusCode || error_type.defaultStatusCode);
  return error;
};
