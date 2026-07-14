import { Router } from "express";
import Product from "../models/product.model.js";

const productsRouter = Router();

// aggregations
productsRouter.get("/metrics-by-category", async (req, res) => {
    try {
        const inventaryByCategory = await Product.aggregate([
            { $match: { status: true } },
            // group by --> los calculos necesarios para obtener la cantidad de productos por categoría y sus valores
            {
                $group: {
                    _id: "$category",
                    totalProducts: { $sum: 1 }, // count 1
                    totalStock: { $sum: "$stock" },
                    totalBrutoByCateogry: {
                        $sum: {
                            $multiply: ["$price", "$stock"],
                        },
                    },
                },
            },
            { $sort: { totalBrutoByCateogry: -1 } },
            // solamente sube a la collection
            // {
            //     $merge: {
            //         into: "inventaryByCategory",
            //         whenMatched: "replace",
            //         whenNotMatched: "insert",
            //     },
            // },
        ]);

        res.status(200).json({ status: "success", data: inventaryByCategory });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

productsRouter.post("/", async (req, res) => {
    try {
        const newProduct = await Product.create(req.body);
        res.status(201).json({ status: "success", data: newProduct });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// para evitar que me traiga todos los productos voy a usar la paginación
// productsRouter.get("/", async (req, res) => {
//     try {
//         const products = await Product.find();
//         res.status(200).json({ status: "success", data: products });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });
//
//

productsRouter.get("/", async (req, res) => {
    try {
        const { page = 1, limit = 10, sort } = req.query;

        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            lean: true,
        };

        if (sort === "asc" || sort === "desc") {
            options.sort = { price: sort === "asc" ? 1 : -1 };
        }

        const result = await Product.paginate({}, options);

        res.status(200).json({
            status: "success",
            data: result.docs,
            totalPages: result.totalPages,
            currentPage: result.page,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
        });
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
