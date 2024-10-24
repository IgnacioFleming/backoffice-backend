import ProductsManager from "../dao/mysql/products.js";
import { generateMockedProducts } from "../mocks/products.js";

const getProducts = async (req, res) => {
  const products = await ProductsManager.getAll();
  res.json({ status: "success", payload: products });
};

const createProduct = async (req, res) => {
  try {
    const { body } = req;
    const newProduct = await ProductsManager.create(body);
    if (newProduct?.error) return res.json({ status: "error", error });
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

export default { getProducts, createProduct, updateProduct, deleteProduct, createMockedProducts };
