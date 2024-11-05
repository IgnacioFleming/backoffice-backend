import { Router } from "express";
import salesController from "../controllers/sales.js";
import { auth } from "../middlewares/auth/auth.js";
export const saleRouter = Router();
saleRouter.use(auth);
saleRouter.get("/", salesController.getAll);
saleRouter.post("/", salesController.create);
saleRouter.delete("/:id", salesController.deleteSale);
