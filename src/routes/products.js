import { Router } from "express";

import productsController from "../controllers/products.js";
import { resources, uploadMiddleware } from "../middlewares/upload/uploader.js";
import { passportCall } from "../middlewares/auth/passportCall.js";
import { strategies } from "../config/passport.js";

export const productsRouter = Router();

productsRouter.use(passportCall(strategies.JWT));

productsRouter.get("/", productsController.getProducts);

productsRouter.get("/:id", productsController.getProductById);

productsRouter.post("/", uploadMiddleware(), productsController.createProduct);

productsRouter.put("/:id", uploadMiddleware({ deletePrevImg: true, resource: resources.PRODUCTS }), productsController.updateProduct);

productsRouter.delete("/:id", productsController.deleteProduct);

//mocks

productsRouter.post("/mocks", productsController.createMockedProducts);
