import { userRoles } from "../../utils/roles.js";

export const authorizationPolicy = (allowedRoles) => {
  return (req, res, next) => {
    const { role } = req.user;
    if (allowedRoles.includes(userRoles.PUBLIC)) return next();
    if (allowedRoles.includes(role)) return next();
    return res.status(403).json({ status: "unauthorized", error: "Unauthorized", redirectURL: "/" });
  };
};
