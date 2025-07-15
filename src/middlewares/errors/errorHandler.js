import CustomError from "../../utils/errors/customError.js";
import { ERRORS } from "../../utils/errors/errorTypes.js";
import { statusTypes } from "../../utils/responses.js";

export const errorHandler = (err, req, res, next) => {
  if (err instanceof CustomError) {
    let message = err.message;
    try {
      message = JSON.parse(message);
    } catch {}
    if (err.name === ERRORS.UNHANDLED.name) console.log(err);
    if (err.name === ERRORS.DATABASE.name) {
      console.log("DATABASE ERROR: ", message);
      message = "There was an error in the database.";
    }
    if (err.name === ERRORS.AUTH.name) return res.status(401).json({ status: statusTypes.UNAUTHORIZED, redirectURL: "/demo-login", message: err.message });
    res.status(err.statusCode).json({ status: statusTypes.ERROR, name: err.name, message });
  } else {
    console.log("Unhandled error", err);
    res.status(500).json({ status: statusTypes.ERROR, name: "unhandled", message: "An unhandled error has ocurred." });
  }
};
