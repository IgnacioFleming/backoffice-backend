import { Router } from "express";
import sessionsController from "../controllers/sessions.js";
import { passportCall } from "../middlewares/auth/passportCall.js";
import { strategies } from "../config/passport.js";
import passport from "passport";

export const sessionRouter = Router();

sessionRouter.post("/register", passport.authenticate(strategies.REGISTER, { session: false }), sessionsController.registerUser);
sessionRouter.post("/login", passportCall(strategies.LOGIN), sessionsController.loginUser);
sessionRouter.post("/logout", sessionsController.logOutUser);

sessionRouter.get("/protected", passportCall(strategies.JWT), (req, res) => {
  res.send({ message: "Authorization granted." });
});

sessionRouter.get("/checkSession", passportCall(strategies.JWT), sessionsController.checkSession);
