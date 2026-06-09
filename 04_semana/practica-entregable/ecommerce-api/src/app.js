import express from "express";
import productRouter from "./routes/products.routes.js";
import cartRouter from "./routes/carts.routes.js";

const app = express();
const VERSIONS_BASE = "/api/v1";

app.use(express.json());

app.get("/health", (req, res) => {
    res.json({ status: "OK" });
});

// ruta base de products
app.use(`${VERSIONS_BASE}/products`, productRouter);

// ruta base de carritos
app.use(`${VERSIONS_BASE}/carts`, cartRouter);

export default app;
