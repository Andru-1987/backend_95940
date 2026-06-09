import { Router } from "express";
import CartManager from "../managers/CartManager.js";

const cartRouter = Router();
const manager = new CartManager();

// POST /carts --> crea un nuevo carrito
cartRouter.post("/", async (req, res) => {
    const cart = await manager.createCart();

    res.status(201).json({
        message: "Cart created successfully",
        data: cart,
    });
});

// obtener los productos del carrito con su id del carrito
cartRouter.get("/:id", async (req, res) => {
    const cart = await manager.getCartById(req.params.id);

    if (!cart) {
        return res.status(404).json({
            message: "Cart not found",
        });
    }

    res.status(200).json({
        message: "Cart found",
        data: cart,
    });
});

// agregar un producto al carrito
cartRouter.post("/:id/products/:productId", async (req, res) => {
    const cart = await manager.addProductToCart(
        req.params.id,
        req.params.productId,
    );

    if (!cart) {
        return res.status(404).json({
            message: "Cart not found",
        });
    }

    res.status(200).json({
        message: "Product added to cart successfully",
        data: cart,
    });
});

export default cartRouter;
