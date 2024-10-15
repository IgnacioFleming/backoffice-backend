import express from "express";
import cors from "cors";
import { productsRouter } from "./routes/products.js";
import { costumerRouter } from "./routes/costumers.js";
import { corsOptions } from "./utils/cors.js";
import { orderRouter } from "./routes/orders.js";
import { saleRouter } from "./routes/sales.js";
import { sessionRouter } from "./routes/sessions.js";
import initializePassport from "./config/passport.js";

const app = express();
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
initializePassport();
app.use("/api/products", productsRouter);
app.use("/api/costumers", costumerRouter);
app.use("/api/orders", orderRouter);
app.use("/api/sales", saleRouter);
app.use("/api/sessions", sessionRouter);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
