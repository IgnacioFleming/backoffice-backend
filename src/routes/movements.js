import { Router } from "express";
import movementsController from "../controllers/movements.js";

export const movementsRouter = Router();
movementsRouter.get("/:costumer_id", movementsController.getMovementsByCostumerId);
