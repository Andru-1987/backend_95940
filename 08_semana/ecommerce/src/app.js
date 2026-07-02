import express from "express";
// import productsRouter from "./routers/products.router.js";
import productsRouter from "./routers/products.mongoose.router.js";

const app = express();

const VERSION = "/api/v1";

app.use(express.json());
app.use(express.urlencoded({ extended: true })); //post   <-- req.body undefined / la informacion parseada

app.get("/", (req, res) => {
    res.json("Hello World!");
});

// app.use(`${VERSION}/products`, productsRouter);
app.use(`${VERSION}/products`, productsRouter);

export default app;
