import { Router } from "express";

import productsController from "../controllers/products.js";
import { auth } from "../middlewares/auth/auth.js";
import { uploadMiddleware } from "../middlewares/upload/uploader.js";

export const productsRouter = Router();

productsRouter.use(auth);

productsRouter.get("/", productsController.getProducts);

productsRouter.get("/:id", productsController.getProductById);

productsRouter.post("/", uploadMiddleware, productsController.createProduct);

productsRouter.put("/:id", productsController.updateProduct);

productsRouter.delete("/:id", productsController.deleteProduct);

//mocks

productsRouter.post("/mocks", productsController.createMockedProducts);
