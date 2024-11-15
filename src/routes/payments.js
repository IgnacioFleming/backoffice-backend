import { Router } from "express";
import paymentsController from "../controllers/payments.js";

export const paymentsRouter = Router();

paymentsRouter.post("/", paymentsController.create);
