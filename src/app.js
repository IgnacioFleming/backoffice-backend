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
import { errorHandler } from "./middlewares/errors/errorHandler.js";
import { unhandledRejection } from "./middlewares/errors/unhadledRejection.js";
import { paymentsRouter } from "./routes/payments.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(cors(corsOptions));
app.use(cookieParser(config.session.secret));
app.use(session({ secret: config.session.secret, store: sessionStore, cookie: { maxAge: 24 * 3600 * 1000, httpOnly: true, sameSite: "none", secure: true }, resave: false, saveUninitialized: false }));
app.set("trust proxy", 1);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
initializePassport();

app.get("/", async (req, res) => {
  console.log("no recibi la cookie ", req.cookies[cookiePrueba]);
  if (req.cookies[cookiePrueba]) return res.send({ payload: req.cookies });
  res.send("No recibo la cookie");
});
app.get("/setCookie", async (req, res) => {
  res.cookie("cookiePrueba", "Esta es una prueba de que la puta cookie funciona").send("cookie seteada");
});

app.use("/api/products", productsRouter);
app.use("/api/costumers", costumerRouter);
app.use("/api/orders", orderRouter);
app.use("/api/sales", saleRouter);
app.use("/api/sessions", sessionRouter);
app.use("/api/balances", balancesRouter);
app.use("/api/movements", movementsRouter);
app.use("/api/users", usersRouter);
app.use("/api/payments", paymentsRouter);

app.use(errorHandler);

process.on("uncaughtException", unhandledRejection);
process.on("unhandledRejection", unhandledRejection);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
