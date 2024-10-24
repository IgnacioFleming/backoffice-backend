import { Router } from "express";

import productsController from "../controllers/products.js";
import { auth } from "../middlewares/auth/auth.js";

export const productsRouter = Router();

productsRouter.use(auth);

productsRouter.get("/", productsController.getProducts);
productsRouter.post("/", productsController.createProduct);

productsRouter.put("/:id", productsController.updateProduct);

productsRouter.delete("/:id", productsController.deleteProduct);

//mocks

productsRouter.post("/mocks", productsController.createMockedProducts);
