import express from "express";
import mockProducts from "./assests/mockProducts.js";
import cors from "cors";

const app = express();

app.use(cors());

app.get("/products", (req, res) => {
  const products = mockProducts;
  res.json({ status: "success", payload: products });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
