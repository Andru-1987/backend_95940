import express from "express";
import { engine } from "express-handlebars";

import config from "./config/index.js";
import usersRouter from "./routers/users.router.js";
import productsRouter from "./routers/products.router.js";
import cartsRouter from "./routers/carts.router.js";
import seedsRouter from "./routers/seeds.router.js";
import viewsRouter from "./routers/views.router.js";

const app = express();
const version = config.version;

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "views");


app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.send(`API v${version}`);
});

//solo dev
app.use(`/`, viewsRouter)
app.use('/dev/products-seed', seedsRouter);

app.use(`/api/v${version}/users`, usersRouter);
app.use(`/api/v${version}/products`, productsRouter);
app.use(`/api/v${version}/carts`, cartsRouter);


export default app;
