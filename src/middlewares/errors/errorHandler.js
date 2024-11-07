import CustomError from "../../utils/errors/customError.js";
import { statusTypes } from "../../utils/responses.js";

export const errorHandler = (err, req, res, next) => {
  if (err instanceof CustomError) {
    let message = err.message;
    try {
      message = JSON.parse(message);
    } catch {}
    res.status(err.statusCode).json({ status: statusTypes.ERROR, name: err.name, message });
  } else {
    console.log("Unhandled error", err);
    res.status(500).json({ status: statusTypes.ERROR, name: "unhandled", message: "An unhandled error has ocurred." });
  }
};
