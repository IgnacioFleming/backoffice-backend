import { Router } from "express";
import ordersController from "../controllers/orders.js";
export const orderRouter = Router();
orderRouter.get("/", ordersController.getAll);
orderRouter.get("/:id", ordersController.getById);
orderRouter.post("/", ordersController.create);
orderRouter.post("/mocks", ordersController.createMockedOrders);
orderRouter.put("/:id", ordersController.update);
orderRouter.put("/:id", ordersController.deleteOrder);
