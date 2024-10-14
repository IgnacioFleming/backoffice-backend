import { Router } from "express";
import salesController from "../controllers/sales.js";
export const saleRouter = Router();
saleRouter.get("/", salesController.getAll);
saleRouter.post("/", salesController.create);
// saleRouter.get("/:id", salesController.getById);
// saleRouter.post("/mocks", salesController.createMockedSales);
// saleRouter.put("/:id", salesController.update);
// saleRouter.delete("/:id", salesController.deleteSale);
