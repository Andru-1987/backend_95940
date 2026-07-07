import { Router } from "express";
import cartController from "../controllers/cart.controller.js";
const cartsRouter = Router();

//crear carrito
cartsRouter.post("/", cartController.cartCreateController);
//listar los productos de un carrito
cartsRouter.get("/:cid", cartController.cartGetController);
// listar los carritos que tiene un usuario
cartsRouter.get("/user/:uid", cartController.cartGetByUserController);
//actualizar un carrito donde ya existe el carrito
cartsRouter.post(
    "/:cid/product/:pid",
    cartController.cartUpdateProductController,
);
//actualizar la cantidad de un producto en un carrito
cartsRouter.patch(
    "/:cid/product/:pid",
    cartController.cartUpdateProductQuantityController,
);
//eliminar un producto de un carrito
cartsRouter.delete(
    "/:cid/product/:pid",
    cartController.cartDeleteProductController,
);
//limpiar un carrito
cartsRouter.delete("/:cid", cartController.cartDeleteController);

export default cartsRouter;
