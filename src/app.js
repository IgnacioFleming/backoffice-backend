import express from "express";
import cors from "cors";
import { productsRouter } from "./routes/products.js";
import { costumerRouter } from "./routes/costumers.js";
import { corsOptions } from "./config/cors.js";
import { orderRouter } from "./routes/orders.js";
import { saleRouter } from "./routes/sales.js";
import { sessionRouter } from "./routes/sessions.js";
import initializePassport from "./config/passport.js";
import session from "express-session";
import config from "./config/config.js";
import passport from "passport";
import { sessionStore } from "./config/sessionsStorage.js";
import { balancesRouter } from "./routes/balances.js";
import { movementsRouter } from "./routes/movements.js";
import { usersRouter } from "./routes/users.js";

const app = express();
app.use(cors(corsOptions));
app.use(session({ secret: config.session.secret, store: sessionStore, cookie: { maxAge: 1000 * 60 * 60 }, resave: true, saveUninitialized: false }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
initializePassport();
app.use("/api/products", productsRouter);
app.use("/api/costumers", costumerRouter);
app.use("/api/orders", orderRouter);
app.use("/api/sales", saleRouter);
app.use("/api/sessions", sessionRouter);
app.use("/api/balances", balancesRouter);
app.use("/api/movements", movementsRouter);
app.use("/api/users", usersRouter);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
