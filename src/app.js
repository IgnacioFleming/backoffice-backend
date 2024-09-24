import express from "express";
import mockProducts from "./assests/mockProducts.js";
import cors from "cors";
import { productSchema } from "./schemas/products.js";

const products = mockProducts;

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/products", (req, res) => {
  res.json({ status: "success", payload: products });
});

app.delete("/api/products/:id", (req, res) => {
  const { id } = req.params;
  const productIndex = mockProducts.findIndex((product) => product.id.toString() === id);
  const deteteProduct = mockProducts.splice(productIndex, 1);
  res.json({ status: "success", payload: mockProducts });
});

app.put("/api/products/:id", (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const productIndex = mockProducts.findIndex((product) => product.id.toString() === id);
    const updatedProducts = mockProducts.map((product) => {
      if (product.id.toString() === id) {
        const { success, data, error } = productSchema.safeParse({ ...product, ...body });
        if (!success) throw new Error(error);
        return data;
      }
      return product;
    });
    res.json({ status: "success", payload: updatedProducts[productIndex] });
  } catch (error) {
    throw new Error(error);
  }
});

app.post("/api/products", (req, res) => {
  try {
    const { body } = req;
    const { success, data, error } = productSchema.safeParse({ id: crypto.randomUUID(), ...body });

    if (!success) return res.json({ success, error });
    products.push(data);

    res.json({ status: "success", payload: data });
  } catch (error) {
    throw new Error(error);
  }
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
