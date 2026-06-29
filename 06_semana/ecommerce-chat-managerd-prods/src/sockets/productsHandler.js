import ProductManager from "../manager/ProductManager.js";
const productManager = new ProductManager();

// standby
const registerProductHandler = (io, socket) => {
    // obtenga los producrtos antes de ir por handlebars
    const products = productManager.getProducts();
    socket.emit("products_initial", products);

    // generar un producto
    socket.on("add_product", async (product) => {
        const result = await productManager.addProduct(product);
        const products = await productManager.getProducts();
        io.emit("products_updated", products);
    });

    // actualizar u n producto
    // eliminar un producto
};

export default registerProductHandler;
