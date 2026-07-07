import express from "express";
import config from "./config/index.js";
import usersRouter from "./routers/users.router.js";
import productsRouter from "./routers/products.router.js";
import cartsRouter from "./routers/carts.router.js";

const app = express();
const version = config.version;

app.use(express.json());

app.get("/", (req, res) => {
    res.send(`API v${version}`);
});

app.use(`/api/v${version}/users`, usersRouter);
app.use(`/api/v${version}/products`, productsRouter);
app.use(`/api/v${version}/carts`, cartsRouter);

export default app;
