import express from "express";
import cors from "cors";
import { productsRouter } from "./routes/products.js";
import { costumerRouter } from "./routes/costumers.js";
import { corsOptions } from "./utils/cors.js";
import { pool } from "./config/dbconfig.js";

const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use("/api/products", productsRouter);
app.use("/api/costumers", costumerRouter);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
