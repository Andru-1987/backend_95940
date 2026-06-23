import { Router } from "express";
import ProductManager from "../manager/ProductManager.js";

const renderingRouter = Router();
const productManager = new ProductManager();

renderingRouter.get("/", (req, res) =>
    res.render("home", { title: "EL Ecommerce de Yahoo!" }),
);

renderingRouter.get("/chat", (req, res) =>
    res.render("chat", { title: "Salas de Chat para la gente de Yahoo!" }),
);

renderingRouter.get("/products", async (req, res) => {
    try {
        const products = await productManager.getProducts();

        res.render("products", {
            title: "Productos de Yahoo!",
            productos: products,
        });
    } catch (error) {
        const errorMessage = error.message || "Error al obtener productos";
        res.status(500).render("products", {
            title: "Productos de Yahoo!",
            products: [],
            error: errorMessage,
        });
    }
});

export default renderingRouter;
