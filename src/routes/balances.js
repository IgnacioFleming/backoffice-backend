import { Router } from "express";
import balancesController from "../controllers/balances.js";
import { passportCall } from "../middlewares/auth/passportCall.js";
import { strategies } from "../config/passport.js";

export const balancesRouter = Router();

balancesRouter.get("/", passportCall(strategies.JWT), balancesController.getAllBalances);
