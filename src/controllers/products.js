import ProductsManager from "../dao/mysql/products.js";
import { generateMockedProducts } from "../mocks/products.js";

const getProducts = async (req, res) => {
  const products = await ProductsManager.getAll();
  res.json({ status: "success", payload: products });
};

const getProductById = async (req, res) => {
  const { id } = req.params;
  const product = await ProductsManager.getById(id);
  res.json({ status: "success", payload: product });
};
const createProduct = async (req, res) => {
  try {
    const { body } = req;
    body.price = parseFloat(body.price);
    body.stock = parseInt(body.stock);
    body.thumbnail = req.fileURL;
    const newProduct = await ProductsManager.create(body);
    if (newProduct?.error) return res.json({ status: "error", error: newProduct.error });
    res.json({ status: "success", payload: newProduct.status });
  } catch (error) {
    console.log("Exception throwed", error);
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;
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
