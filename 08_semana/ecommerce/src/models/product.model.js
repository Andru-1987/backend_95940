import { Schema, model } from "mongoose";

const schema = new Schema(
    {
        name: { type: String, required: true, unique: true }, // Nombre del producto con restricción de unicidad
        description: { type: String },
        price: { type: Number },
        stock: { type: Number },
    },
    {
        // strict: true,
        // versionKey: false,
        timestamps: true,
    },
);

const Product = model("Product", schema);

export default Product;
