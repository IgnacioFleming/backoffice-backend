import { Router } from "express";
import sessionsController from "../controllers/sessions.js";
import { passportCall } from "../middlewares/auth/passportCall.js";
import { strategies } from "../config/passport.js";

export const sessionRouter = Router();

sessionRouter.post("/register", passportCall(strategies.REGISTER), sessionsController.registerUser);
sessionRouter.post("/login", passportCall(strategies.LOGIN), sessionsController.loginUser);
sessionRouter.get("/protected", (req, res) => {
  res.send({ message: "Authorization granted." });
});
