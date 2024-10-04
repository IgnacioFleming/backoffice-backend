import { Router } from "express";
import costumersController from "../controllers/costumers.js";

export const costumerRouter = Router();

costumerRouter.get("/", costumersController.getCostumers);
costumerRouter.post("/", costumersController.createCostumer);

costumerRouter.put("/:id", costumersController.updateCostumer);

costumerRouter.delete("/:id", costumersController.deleteCostumer);
costumerRouter.post("/mocks", costumersController.createMockedCostumers);
