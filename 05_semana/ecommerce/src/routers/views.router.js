import { Router } from "express";
import ProductManager from "../manager/ProductsManager.js";
import FileManager from "../manager/FileManager.js";

import upload from "../utils/uploader.js";

const routerViews = Router();
const productManager = new ProductManager();
const fileManager = new FileManager();

routerViews.get("/", (req, res) => res.redirect("/catalogo"));
routerViews.get("/catalogo", async (req, res) => {
    try {
        const products = await productManager.getProducts();
        console.log(products);
        res.render("catalogo", { products });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al obtener productos");
    }
});

routerViews.get("/upload", (req, res) => res.render("upload"));

routerViews.post("/uploader", upload.single("image"), async (req, res) => {
    const { productId } = req.body;
    const filePath = req.file;

    if (!productId || !filePath) {
        return res.status(400).send("ProductId and image are required");
    }

    await fileManager.addUploadedFile(req.file);

    const productToUpdate = { thumbnails: [filePath?.filename] };

    try {
        await productManager.updateProduct(productId, productToUpdate);
        res.send("Image uploaded successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al actualizar imagen");
    }
});

export default routerViews;
