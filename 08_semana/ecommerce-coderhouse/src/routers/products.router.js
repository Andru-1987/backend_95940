import { Router } from "express";
import Product from "../models/product.model.js";

const productsRouter = Router();

productsRouter.post("/", async (req, res) => {
    try {
        const newProduct = await Product.create(req.body);
        res.status(201).json({ status: "success", data: newProduct });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

productsRouter.get("/", async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({ status: "success", data: products });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

productsRouter.get("/:pid", async (req, res) => {
    try {
        const product = await Product.findById(req.params.pid);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.status(200).json({ status: "success", data: product });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
productsRouter.patch("/:pid", async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.pid,
            req.body,
            { new: true, runValidators: true },
        );
        if (!updatedProduct) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.status(200).json({ status: "success", data: updatedProduct });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

productsRouter.delete("/:pid", async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.pid);

        if (!deletedProduct) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.status(200).json({ status: "success", data: deletedProduct });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default productsRouter;
