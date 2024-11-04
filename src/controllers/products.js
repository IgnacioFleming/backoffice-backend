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
    const payload = await controllerHandlers.validateBody(res, body, ProductsManager);
    responses.successResponse(res, payload);
  } catch (error) {
    return responses.serverErrorResponse(res, error);
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;
    body.price = parseFloat(body.price);
    body.stock = parseInt(body.stock);
    req.fileURL && (body.thumbnail = req.fileURL);
    console.log(body.thumbnail);
    req.imgPublicId && (body.thumbnail_public_id = req.imgPublicId);
    const updateProduct = await ProductsManager.update(id, body);
    res.json({ status: "success", payload: updateProduct });
  } catch (error) {
    console.log("Exception throwed", error);
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const deleteProduct = await ProductsManager.delete(id);
  res.json({ status: "success", payload: deleteProduct.status });
};

const createMockedProducts = async (req, res) => {
  const { quantity } = req.query;
  const mockedProducts = await generateMockedProducts(quantity);
  mockedProducts.forEach(async (product) => {
    await ProductsManager.create(product);
  });
  res.json({ status: "success", payload: "Products created" });
};

export default { getProducts, createProduct, updateProduct, deleteProduct, createMockedProducts, getProductById };
