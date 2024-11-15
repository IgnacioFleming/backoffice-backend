import passport from "passport";
import { createCustomError } from "../../utils/errors/errorFactory.js";
import { ERRORS } from "../../utils/errors/errorTypes.js";
export const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, { session: true }, (err, user, info) => {
      if (err) {
        const error = createCustomError(ERRORS.UNHANDLED, err);
        return next(error);
      }

      if (!user) {
        const error = createCustomError(ERRORS.AUTH, info?.message);
        return next(error);
      }
      console.log(user);
      console.log(req.user);
      console.log(req.session);

      req.user = user;
      req.session.passport = { user: { id: user.id } };
      req.isAuthenticated = () => req.session.passport.user && true;
      console.log(req.isAuthenticated());
      next();
    })(req, res, next);
  };
};
