import passport from "passport";
export const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, { session: true }, (err, user, info) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.send({ status: "error", message: info?.message });
      }
      req.user = user;
      req.session.passport = { user: { id: user.id } };
      req.isAuthenticated = () => req.session.passport.user && true;
      req.signOut = async () => {
        delete req.session.passport;
        delete req.user;
        return;
      };
      next();
    })(req, res, next);
  };
};
