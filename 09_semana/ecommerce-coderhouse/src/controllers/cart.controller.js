import Cart from "../models/cart.model.js";
import User from "../models/user.model.js";
import Product from "../models/product.model.js";

class CartController {
    constructor() {
        this.cartModel = Cart;
        this.userModel = User;
        this.productModel = Product;
    }

    async cartCreateController(req, res) {
        try {
            const { user } = req.body;
            const existUser = await this.userModel.findById(user);

            if (!existUser) {
                return res.status(404).json({ error: "User not found" });
            }

            const cart = await this.cartModel.create({ user, products: [] });
            res.status(201).json({ status: "success", data: cart });
        } catch (error) {
            res.status(400).json({ status: "error", error: error.message });
        }
    }

    //listar los productos de un carrito
    async cartGetController(req, res) {
        try {
            const cart = await this.cartModel
                .findById(req.params.id)
                .populate("products.product")
                .populate("user", "firstName email");
            if (!cart) {
                return res
                    .status(404)
                    .json({ status: "error", error: "Cart not found" });
            }

            res.status(200).json({ status: "success", data: cart });
        } catch (error) {
            res.status(500).json({ status: "error", error: error.message });
        }
    }
    // listar los carritos que tiene un usuario
    async cartGetByUserController(req, res) {
        try {
            const carts = await this.cartModel
                .find({ user: req.params.user })
                .populate("products.product")
                .populate("user", "email");

            if (!carts) {
                return res
                    .status(404)
                    .json({ status: "error", error: "Carts not found" });
            }

            res.status(200).json({ status: "success", data: carts });
        } catch (error) {
            res.status(500).json({ status: "error", error: error.message });
        }
    }
    //actualizar un carrito donde ya existe el carrito
    async cartUpdateProductController(req, res) {
        try {
            const { cid, pid } = req.params;
            const { quantity } = req.body;

            const product = await this.productModel.findById(pid);
            if (!product) {
                return res
                    .status(404)
                    .json({ status: "error", error: "Product not found" });
            }
            const cart = await this.cartModel.findById(cid);
            if (!cart) {
                return res
                    .status(404)
                    .json({ status: "error", error: "Cart not found" });
            }

            const existItem = cart.products.find(
                (item) => item.product.toString() === pid,
            );

            if (existItem) {
                existItem.quantity = quantity ?? existItem.quantity;
            } else {
                cart.products.push({ product: pid, quantity: quantity ?? 1 });
            }

            await cart.save();
            res.status(400).json({ status: "success", cart });
        } catch (error) {
            res.status(500).json({ status: "error", error: error.message });
        }
    }

    //actualizar la cantidad de un producto en un carrito
    async cartUpdateProductQuantityController(req, res) {
        try {
            const { cid, pid } = req.params;
            const { quantity } = req.body;

            const cart = await this.cartModel.findById(cid);
            if (!cart) {
                return res
                    .status(404)
                    .json({ status: "error", error: "Cart not found" });
            }

            const existItem = cart.products.find(
                (item) => item.product.toString() === pid,
            );

            if (existItem) {
                existItem.quantity = quantity;
            }

            await cart.save();
            res.status(200).json({ status: "success", cart });
        } catch (error) {
            res.status(500).json({ status: "error", error: error.message });
        }
    }

    //eliminar un producto de un carrito
    async cartDeleteProductController(req, res) {
        try {
            const { cid, pid } = req.params;

            const cart = await this.cartModel.findById(cid);
            if (!cart) {
                return res
                    .status(404)
                    .json({ status: "error", error: "Cart not found" });
            }

            cart.products = cart.products.filter(
                (item) => item.product.toString() !== pid,
            );

            await cart.save();
            res.status(200).json({ status: "success", cart });
        } catch (error) {
            res.status(500).json({ status: "error", error: error.message });
        }
    }

    //limpiar un carrito
    async cartDeleteController(req, res) {
        try {
            const { cid } = req.params;

            const cart = await this.cartModel.findByIdAndUpdate(
                cid,
                { products: [] },
                { new: true },
            );

            if (!cart) {
                return res
                    .status(404)
                    .json({ status: "error", error: "Cart not found" });
            }

            await cart.save();
            res.status(200).json({
                status: "success",
                message: "Cart deleted",
            });
        } catch (error) {
            res.status(500).json({ status: "error", error: error.message });
        }
    }

}

const cartController = new CartController();

export default cartController;
