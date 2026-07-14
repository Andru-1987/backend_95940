import { Router } from "express";
import Product from "../models/product.model.js"; // Ajusta la ruta

const seedsRouter = Router();

const categories = [
    "Electronics",
    "Computers",
    "Gaming",
    "Home",
    "Sports",
    "Books",
    "Clothing",
    "Office",
    "Toys",
    "Automotive",
];

const adjectives = [
    "Premium",
    "Smart",
    "Portable",
    "Professional",
    "Wireless",
    "Compact",
    "Advanced",
    "Digital",
    "Ultra",
    "Eco",
];

const products = [
    "Headphones",
    "Keyboard",
    "Mouse",
    "Monitor",
    "Chair",
    "Desk",
    "Laptop",
    "Camera",
    "Speaker",
    "Microphone",
    "Tablet",
    "Phone",
    "Watch",
    "Router",
    "Printer",
    "Backpack",
    "Bottle",
    "Lamp",
    "Drone",
    "Controller",
];

const data = [];

for (let i = 1; i <= 100; i++) {
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const product = products[Math.floor(Math.random() * products.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];

    data.push({
        title: `${adjective} ${product}`,
        description: `Description for ${adjective} ${product}. Ideal for everyday use.`,
        code: `PRD-${String(i).padStart(4, "0")}-${Date.now().toString()}`,
        price: Number((Math.random() * 900 + 50).toFixed(2)),
        status: Math.random() > 0.1,
        stock: Math.floor(Math.random() * 100),
        category,
        thumbnail: [`https://picsum.photos/seed/product-${i}/600/600`],
    });
}

seedsRouter.post("/", async (req, res) => {
    try {
        await Product.insertMany(data);
        res.status(200).json({
            message: `${data.length} products inserted successfully.`,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default seedsRouter;
