import passport from "passport";
export const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, { session: false }, (err, user, info) => {
      console.log(info);
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.send({ status: "error", message: info?.message });
      }
      req.user = user;
      next();
    })(req, res, next);
  };
};
