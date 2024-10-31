import { Router } from "express";
import costumersController from "../controllers/costumers.js";
import { auth } from "../middlewares/auth/auth.js";
import { resources, uploadMiddleware } from "../middlewares/upload/uploader.js";

export const costumerRouter = Router();

costumerRouter.use(auth);
costumerRouter.get("/", costumersController.getCostumers);
costumerRouter.post("/", uploadMiddleware(), costumersController.createCostumer);

costumerRouter.put("/:id", uploadMiddleware({ deletePrevImg: true, resource: resources.COSTUMERS }), costumersController.updateCostumer);

costumerRouter.delete("/:id", costumersController.deleteCostumer);
costumerRouter.post("/mocks", costumersController.createMockedCostumers);
