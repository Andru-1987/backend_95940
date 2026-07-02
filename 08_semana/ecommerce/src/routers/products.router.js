import { Router } from "express";
import client from "../connections/mongo.connnect.js";
import { ObjectId } from "mongodb";
const collection = client.db("ecommerce").collection("products");

const productsRouter = Router();

// GET /products - Obtener todos los productos
productsRouter.get("/", async (req, res) => {
    try {
        const products = await collection.find({}).toArray();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /products/:id - Obtener un producto por su ID
productsRouter.get("/:id", async (req, res) => {
    try {
        const product = await collection.findOne({
            _id: new ObjectId(req.params.id), // esto no falla por que lo transforma automáticamente
            // _id: req.params.id, // esto falla
        });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /products - Crear un nuevo producto
productsRouter.post("/", async (req, res) => {
    try {
        const productNoSchema = req.body;

        const result = await collection.insertOne(productNoSchema);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /products/:id - Actualizar un producto por su ID --> PATCH
productsRouter.put("/:id", async (req, res) => {
    try {
        const productNoSchema = req.body;
        const result = await collection.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: productNoSchema },
        );
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /products/:id - Eliminar un producto por su ID
productsRouter.delete("/:id", async (req, res) => {
    try {
        const result = await collection.deleteOne({
            _id: new ObjectId(req.params.id),
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default productsRouter;
