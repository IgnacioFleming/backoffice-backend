import { Router } from "express";
import sessionsController from "../controllers/sessions.js";

export const sessionRouter = Router();

sessionRouter.post("/register", sessionsController.registerUser);
