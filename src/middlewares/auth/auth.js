import { createCustomError } from "../../utils/errors/errorFactory.js";
import { ERRORS } from "../../utils/errors/errorTypes.js";

export const auth = async (req, res, next) => {
  console.log(req.user, "req.user");
  console.log(req.session, "req.session");
  if (!req.isAuthenticated()) {
    const error = createCustomError(ERRORS.AUTH);
    next(error);
  }
  next();
};
