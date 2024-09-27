import { productSchema } from "../schemas/products.js";
import mockProducts from "../assests/mockProducts.js";
const products = mockProducts;

const getProducts = async (req, res) => {
  res.json({ status: "success", payload: products });
};

const createProduct = async (req, res) => {
  try {
    const { body } = req;
    body.id = products[products.length - 1].id + 1;
    const { success, data, error } = productSchema.safeParse(body);

    if (!success) return res.json({ success, error });
    products.push(data);

    res.json({ status: "success", payload: data });
  } catch (error) {
    console.log("Exception throwed", error);
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const productIndex = products.findIndex((product) => product.id.toString() === id);
    const updatedProducts = products.map((product) => {
      if (product.id.toString() === id) {
        const { success, data, error } = productSchema.safeParse({ ...product, ...body });
        if (!success) throw res.json({ status: "error", error });
        return data;
      }
      return product;
    });
    res.json({ status: "success", payload: updatedProducts[productIndex] });
  } catch (error) {
    console.log("Exception throwed", error);
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const productIndex = mockProducts.findIndex((product) => product.id.toString() === id);
  const deteteProduct = mockProducts.splice(productIndex, 1);
  res.json({ status: "success", payload: mockProducts });
};

export default { getProducts, createProduct, updateProduct, deleteProduct };
