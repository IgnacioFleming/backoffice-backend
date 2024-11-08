import ProductsManager from "../dao/mysql/products.js";
import { generateMockedProducts } from "../mocks/products.js";
import { productSchemaOptional } from "../schemas/product.js";
import controllerHandlers from "../utils/controllerHandlers.js";
import { createCustomError } from "../utils/errors/errorFactory.js";
import { ERRORS } from "../utils/errors/errorTypes.js";
import responses from "../utils/responses.js";
import { modelMethods } from "../utils/utils.js";

const getProducts = async (req, res, next) => {
  try {
    await controllerHandlers.getResources(ProductsManager, res);
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { payload } = await controllerHandlers.getResourcesById(ProductsManager, id);
    responses.successResponse(res, payload);
  } catch (error) {
    next(error);
  }
};
const createProduct = async (req, res, next) => {
  try {
    const body = controllerHandlers.productsBodyHandler(req);
    const { validatedBody } = await controllerHandlers.validateBody(body, productSchemaOptional);
    await controllerHandlers.callModelAndRespond(res, validatedBody, ProductsManager, modelMethods.CREATE);
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { payload: product } = await controllerHandlers.getResourcesById(ProductsManager, id);
    if (!product) throw createCustomError(ERRORS.NOT_FOUND, "ID provided does not correspond to a product");
    const body = controllerHandlers.productsBodyHandler(req);
    const updateBody = { ...product, ...body };
    console.log(updateBody);
    const { validatedBody } = await controllerHandlers.validateBody(updateBody, productSchemaOptional);
    await controllerHandlers.callModelAndRespond(res, validatedBody, ProductsManager, modelMethods.UPDATE, id);
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    await controllerHandlers.deleteResource(req, res, ProductsManager);
  } catch (error) {
    next(error);
  }
};

const createMockedProducts = async (req, res, next) => {
  try {
    const { quantity } = req.query;
    const mockedProducts = await generateMockedProducts(quantity);
    mockedProducts.forEach(async (product) => {
      await ProductsManager.create(product);
    });
    responses.successResponse(res, "Mocked products created successfully.");
  } catch (error) {
    next(error);
  }
};

export default { getProducts, createProduct, updateProduct, deleteProduct, createMockedProducts, getProductById };
