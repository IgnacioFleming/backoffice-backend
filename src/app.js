import express from "express";
import mockProducts from "./assests/mockProducts.js";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/products", (req, res) => {
  const products = mockProducts;

  res.json({ status: "success", payload: products });
});

app.delete("/api/products/:id", (req, res) => {
  const { id } = req.params;
  const productIndex = mockProducts.findIndex((product) => product.id.toString() === id);
  const deteteProduct = mockProducts.splice(productIndex, 1);
  res.json({ status: "success", payload: mockProducts });
});

app.put("/api/products/:id", (req, res) => {
  const { id } = req.params;
  const { body } = req;
  const productIndex = mockProducts.findIndex((product) => product.id.toString() === id);
  const updatedProducts = mockProducts.map((product) => {
    if (product.id.toString() === id) return { ...product, ...body };
    return product;
  });
  res.json({ status: "success", payload: updatedProducts[productIndex] });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
