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
      req.user = user;
      next();
    })(req, res, next);
  };
};

// const token = ExtractJWT.fromAuthHeaderAsBearerToken()(jwt_payload);
//   isTokenRevoked(token, (err, revoked) => {
//     if (revoked) return done(null, false, { message: "Invalid token" });
//     return done(null, jwt_payload);
//   });
