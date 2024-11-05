import ProductsManager from "../dao/mysql/products.js";
import { generateMockedProducts } from "../mocks/products.js";
import controllerHandlers from "../utils/controllerHandlers.js";
import responses from "../utils/responses.js";

const getProducts = async (req, res) => {
  const payload = await controllerHandlers.getResources(ProductsManager, res);
  responses.successResponse(res, payload);
};

const getProductById = async (req, res) => {
  const { id } = req.params;
  const payload = await controllerHandlers.getResourcesById(id);
  responses.successResponse(res, payload);
};
const createProduct = async (req, res) => {
  try {
    const body = controllerHandlers.productsBodyHandler(req);
    const payload = await controllerHandlers.validateBody(res, body, ProductsManager, "create");
    responses.successResponse(res, payload);
  } catch (error) {
    return responses.serverErrorResponse(res, error);
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const body = controllerHandlers.productsBodyHandler(req);
    const payload = await controllerHandlers.validateBody(res, body, ProductsManager, "update", id);
    responses.successResponse(res, payload);
  } catch (error) {
    return responses.serverErrorResponse(res, error);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const payload = await controllerHandlers.deleteResource(req, ProductsManager);
    responses.successResponse(res, payload);
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
