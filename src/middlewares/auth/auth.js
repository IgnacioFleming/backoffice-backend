import { createCustomError } from "../../utils/errors/errorFactory.js";
import { ERRORS } from "../../utils/errors/errorTypes.js";

export const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Session ")) {
    const error = createCustomError(ERRORS.AUTH);
    return next(error);
  }

  const token = authHeader.split(" ")[1];

  req.sessionStore.get(token, (err, session) => {
    if (err || !session) {
      const error = createCustomError(ERRORS.AUTH);
      return next(error);
    }

    req.session = session;

    next();
  });
};
