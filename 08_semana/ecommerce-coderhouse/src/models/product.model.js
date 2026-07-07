import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title: { type: String, require: [true, "Title is required"] },
    description: { type: String, require: [true, "Description is required"] },
    code: { type: String, unique: true, require: [true, "Code is required"] },
    price: {
        type: Number,
        require: true,
        min: [0, "Price must be greater than or equal to 0"],
    },
    status: { type: Boolean, default: true },
    stock: {
        type: Number,
        require: true,
        min: [0, "Stock must be greater than or equal to 0"],
    },
    category: { type: String, require: true },
    thumbnail: { type: [String], default: [] },
});

const Product = mongoose.model("Product", productSchema);

export default Product;
