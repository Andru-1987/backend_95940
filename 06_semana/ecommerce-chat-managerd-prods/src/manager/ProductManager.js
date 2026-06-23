import __joiner from "../utils/paths.js";
import checkFileExists from "../utils/checkFile.js";
import fs from "fs/promises";
import { ObjectId } from "mongodb";

const FILE_PATH = __joiner("products.json");

class ProductManager {
    async _read() {
        const exists = await checkFileExists(FILE_PATH);
        if (!exists) return [];
        const data = await fs.readFile(FILE_PATH, "utf-8");
        return JSON.parse(data);
    }

    async _write(data) {
        await fs.writeFile(FILE_PATH, JSON.stringify(data, null, 2));
    }

    async getProducts() {
        return await this._read();
    }

    async getProductById(id) {
        const products = await this._read();
        return products.find((p) => p.id === id);
    }

    async addProduct(product) {
        const id = new ObjectId();
        const products = await this._read();
        const newProduct = { ...product, id: id.toHexString() };
        products.push(newProduct);
        await this._write(products);
        return newProduct;
    }

    async updateProduct(id, product) {
        const products = await this._read();
        const index = products.findIndex((p) => p.id === id);

        if (index === -1) return null;

        const updatedProduct = { ...products[index], ...product, id };

        products[index] = updatedProduct;

        await this._write(products);
        return updatedProduct;
    }

    async deleteProduct(id) {
        const products = await this._read();
        const index = products.findIndex((p) => p.id === id);

        if (index === -1) return null;

        const deletedProduct = products.splice(index, 1);
        await this._write(products);
        return deletedProduct[0];
    }
}

export default ProductManager;
