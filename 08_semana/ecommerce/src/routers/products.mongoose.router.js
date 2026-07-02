import { Router } from "express";
import Product from "../models/product.model.js";

const productsRouter = Router();

productsRouter.get("/", async (req, res) => {
    const products = await Product.find().lean();
    res.json(products);
});
productsRouter.post("/", async (req, res) => {
    try {
        const result = await Product.create(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
productsRouter.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).lean();
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
productsRouter.put("/:id", async (req, res) => {
    try {
        const result = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true },
        ).lean();

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
productsRouter.delete("/:id", async (req, res) => {
    try {
        const result = await Product.findByIdAndDelete(req.params.id);

        if (!result) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json({ message: "Product deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default productsRouter;
