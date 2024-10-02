import ProductsManager from "../dao/mysql/products.js";

const getProducts = async (req, res) => {
  const products = await ProductsManager.getAll();
  res.json({ status: "success", payload: products });
};

const createProduct = async (req, res) => {
  try {
    const { body } = req;
    const newProduct = await ProductsManager.create(body);
    if (newProduct?.error) return res.json({ status: "error", error });
    res.json({ status: "success", payload: newProduct });
  } catch (error) {
    console.log("Exception throwed", error);
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const updateProduct = await ProductsManager.update(id, body);
    console.log(updateProduct);
    res.json({ status: "success", payload: updateProduct });
  } catch (error) {
    console.log("Exception throwed", error);
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const deteteProduct = await ProductsManager.delete(id);
  res.json({ status: "success", payload: deleteProduct });
};

export default { getProducts, createProduct, updateProduct, deleteProduct };
