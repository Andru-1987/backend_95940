import { Router } from "express";
const viewsRouter = Router();
import Product from "../models/product.model.js";

viewsRouter.get("/products", async (req, res) => {
    try {
        const { page = 1, limit = 5, sort } = req.query;

        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            lean: true,
        };

        if (sort === "asc" || sort === "desc") {
            options.sort = { price: sort === "asc" ? 1 : -1 };
        }

        const result = await Product.paginate({}, options);

        res.render("products", {
            products: result.docs,
            pagination: {
                totalItemsPerpage: result.docs.length,
                totalItems: result.totalDocs,
                totalPages: result.totalPages,
                currentPage: result.page,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                limit: parseInt(limit),
                sort: sort || "asc",
            },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default viewsRouter;
