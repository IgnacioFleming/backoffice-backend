import { Router } from "express";

import productsController from "../controllers/products.js";
import { auth } from "../middlewares/auth/auth.js";
import { resources, uploadMiddleware } from "../middlewares/upload/uploader.js";

export const productsRouter = Router();

productsRouter.use(auth);

productsRouter.get("/", productsController.getProducts);

productsRouter.get("/:id", productsController.getProductById);

productsRouter.post("/", uploadMiddleware(), productsController.createProduct);

productsRouter.put("/:id", uploadMiddleware({ deletePrevImg: true, resource: resources.PRODUCTS }), productsController.updateProduct);

productsRouter.delete("/:id", productsController.deleteProduct);

//mocks

productsRouter.post("/mocks", productsController.createMockedProducts);
