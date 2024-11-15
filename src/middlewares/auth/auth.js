import { createCustomError } from "../../utils/errors/errorFactory.js";
import { ERRORS } from "../../utils/errors/errorTypes.js";

export const auth = async (req, res, next) => {
  if (!req.isAuthenticated()) {
    const error = createCustomError(ERRORS.AUTH);
    next(error);
  }
  next();
};
