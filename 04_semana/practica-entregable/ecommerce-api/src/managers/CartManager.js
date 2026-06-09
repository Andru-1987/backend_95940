import __joiner from "../utils/paths.js";
import fs from "fs/promises";
import checkFileExists from "../utils/checkFile.js";

const FILE_PATH = __joiner("carts.json");

class CartManager {
    async _read() {
        const exists = await checkFileExists(FILE_PATH);
        if (!exists) return [];
        const data = await fs.readFile(FILE_PATH, "utf-8");
        return JSON.parse(data);
    }

    async _write(data) {
        await fs.writeFile(FILE_PATH, JSON.stringify(data, null, 2));
    }

    async createCart() {
        const carts = await this._read();
        const newCart = { id: carts.length + 1, products: [] };

        carts.push(newCart);

        await this._write(carts);
        return newCart;
    }

    async getCartById(id) {
        const carts = await this._read();
        return carts.find((cart) => cart.id === Number(id));
    }

    async addProductToCart(cartId, productId) {
        const carts = await this._read();
        const cart = carts.find((cart) => cart.id === Number(cartId));

        if (!cart) throw new Error("Cart not found");

        const product = cart.products.find((p) => p.productId === productId);

        if (product) {
            product.quantity += 1;
        } else {
            cart.products.push({ productId, quantity: 1 });
        }

        await this._write(carts);
        return cart;
    }
}

export default CartManager;
