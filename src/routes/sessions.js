import { Router } from "express";
import sessionsController from "../controllers/sessions.js";
import { passportCall } from "../middlewares/auth/passportCall.js";
import { strategies } from "../config/passport.js";
import { auth } from "../middlewares/auth/auth.js";

export const sessionRouter = Router();

sessionRouter.post("/register", passportCall(strategies.REGISTER), sessionsController.registerUser);
sessionRouter.post("/login", passportCall(strategies.LOGIN), sessionsController.loginUser);
sessionRouter.post("/logout", sessionsController.logOutUser);

sessionRouter.get("/protected", auth, (req, res) => {
  res.send({ message: "Authorization granted." });
});

sessionRouter.get("/checkSession", auth, sessionsController.checkSession);
