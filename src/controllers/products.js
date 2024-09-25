import { productSchema } from "../schemas/products.js";
import mockProducts from "../assests/mockProducts.js";
const products = mockProducts;

const getProducts = async (req, res) => {
  res.json({ status: "success", payload: products });
};

const createProduct = async (req, res) => {
  try {
    const { body } = req;
    const { success, data, error } = productSchema.safeParse({ id: crypto.randomUUID(), ...body });

    if (!success) return res.json({ success, error });
    products.push(data);

    res.json({ status: "success", payload: data });
  } catch (error) {
    throw new Error(error);
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
    console.log("Exception throwed");
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const productIndex = mockProducts.findIndex((product) => product.id.toString() === id);
  const deteteProduct = mockProducts.splice(productIndex, 1);
  res.json({ status: "success", payload: mockProducts });
};

export default { getProducts, createProduct, updateProduct, deleteProduct };
