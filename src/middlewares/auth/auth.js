export const auth = async (req, res, next) => {
  if (!req.isAuthenticated()) return res.send({ status: "unauthorized", redirectURL: "/login" });
  next();
};
