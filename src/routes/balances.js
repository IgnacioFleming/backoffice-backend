import { Router } from "express";
import balancesController from "../controllers/balances.js";
import { auth } from "../middlewares/auth/auth.js";

export const balancesRouter = Router();

balancesRouter.get("/", auth, balancesController.getAllBalances);
