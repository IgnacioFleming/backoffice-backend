import { Router } from "express";

import productsController from "../controllers/products.js";

export const productsRouter = Router();

productsRouter.get("/", productsController.getProducts);
productsRouter.post("/", productsController.createProduct);

productsRouter.put("/:id", productsController.updateProduct);

productsRouter.delete("/:id", productsController.deleteProduct);
