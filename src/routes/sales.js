import { Router } from "express";
import salesController from "../controllers/sales.js";
export const saleRouter = Router();
saleRouter.get("/", salesController.getAll);
// saleRouter.get("/:id", salesController.getById);
// saleRouter.post("/", salesController.create);
// saleRouter.post("/mocks", salesController.createMockedSales);
// saleRouter.put("/:id", salesController.update);
// saleRouter.delete("/:id", salesController.deleteSale);
