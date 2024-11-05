import ProductsManager from "../dao/mysql/products.js";
import { generateMockedProducts } from "../mocks/products.js";
import { productSchema } from "../schemas/product.js";
import controllerHandlers from "../utils/controllerHandlers.js";
import responses from "../utils/responses.js";
import { modelMethods } from "../utils/utils.js";

const getProducts = async (req, res) => {
  await controllerHandlers.getResources(ProductsManager, res);
};

const getProductById = async (req, res) => {
  const { id } = req.params;
  await controllerHandlers.getResourcesById(id);
};
const createProduct = async (req, res) => {
  try {
    const body = controllerHandlers.productsBodyHandler(req);
    const { validatedBody } = await controllerHandlers.validateBody(res, body, productSchema);
    await controllerHandlers.callModelAndRespond(res, validatedBody, ProductsManager, modelMethods.CREATE);
  } catch (error) {
    return responses.serverErrorResponse(res, error);
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const body = controllerHandlers.productsBodyHandler(req);
    const { validatedBody } = await controllerHandlers.validateBody(res, body, productSchema);
    await controllerHandlers.callModelAndRespond(res, validatedBody, ProductsManager, modelMethods.updateProduct, id);
  } catch (error) {
    return responses.serverErrorResponse(res, error);
  }
};

const deleteProduct = async (req, res) => {
  try {
    await controllerHandlers.deleteResource(req, ProductsManager);
  } catch (error) {
    return responses.serverErrorResponse(res, error);
  }
};

const createMockedProducts = async (req, res) => {
  const { quantity } = req.query;
  const mockedProducts = await generateMockedProducts(quantity);
  mockedProducts.forEach(async (product) => {
    await ProductsManager.create(product);
  });
  responses.successResponse(res, "Mocked products created successfully.");
};

export default { getProducts, createProduct, updateProduct, deleteProduct, createMockedProducts, getProductById };
