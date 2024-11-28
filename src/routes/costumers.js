import { Router } from "express";
import costumersController from "../controllers/costumers.js";
import { resources, uploadMiddleware } from "../middlewares/upload/uploader.js";
import { passportCall } from "../middlewares/auth/passportCall.js";
import { strategies } from "../config/passport.js";

export const costumerRouter = Router();

costumerRouter.use(passportCall(strategies.JWT));
costumerRouter.get("/", costumersController.getCostumers);
costumerRouter.post("/", uploadMiddleware(), costumersController.createCostumer);

costumerRouter.put("/:id", uploadMiddleware({ deletePrevImg: true, resource: resources.COSTUMERS }), costumersController.updateCostumer);

costumerRouter.delete("/:id", costumersController.deleteCostumer);
costumerRouter.post("/mocks", costumersController.createMockedCostumers);
