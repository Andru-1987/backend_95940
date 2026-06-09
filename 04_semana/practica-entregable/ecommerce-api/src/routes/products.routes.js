import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const productRouter = Router();
// TODO -> Crear el manager
const manager = new ProductManager();

// GET /api/v1/products -> listar todos los productos
productRouter.get("/", async (req, res) => {
    res.status(200).json({
        status: "success",
        data: await manager.getProducts(),
    });
});

// GET /api/v1/products/:id -> obtener un producto por id
productRouter.get("/:id", async (req, res) => {
    const product = await manager.getProductById(req.params.id);

    if (!product) {
        return res.status(404).json({
            status: "error",
            message: "Product not found",
        });
    }

    res.status(200).json({
        status: "success",
        data: product,
    });
});

// POST /api/v1/products -> crear un producto
productRouter.post("/", async (req, res) => {
    try {
        const product = await manager.addProduct(req.body);

        res.status(201).json({
            status: "success",
            data: product,
        });
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message,
        });
    }
});

// PUT /api/v1/products/:id -> actualizar un producto
productRouter.put("/:id", async (req, res) => {
    try {
        const product = await manager.updateProduct(req.params.id, req.body);

        res.status(200).json({
            status: "success",
            data: product,
        });
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message,
        });
    }
});

// DELETE /api/v1/products/:id -> eliminar un producto
productRouter.delete("/:id", async (req, res) => {
    try {
        const { code } = await manager.deleteProduct(req.params.id);

        res.status(200).json({
            status: "success",
            data: `Product code: ${code} deleted successfully`,
        });
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message,
        });
    }
});

export default productRouter;
