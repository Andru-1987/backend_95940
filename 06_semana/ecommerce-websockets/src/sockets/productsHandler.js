import ProductManager from '../manager/ProductManager.js'; 
const productManager = new ProductManager();

export default async function registerProductHandlers(io, socket) {
    
    // Lista inicial (usado si el frontend no la carga por Handlebars)
    const listaInicial = await productManager.getProducts();
    socket.emit('productos_iniciales', listaInicial);

    // NUEVO PRODUCTO
    socket.on('nuevo_producto', async (producto) => {
        await productManager.addProduct(producto);
        const productosActualizados = await productManager.getProducts();
        io.emit('productos_actualizados', productosActualizados);
    });

    // =====================================
    // NUEVO: ACTUALIZAR PRODUCTO
    // =====================================
    socket.on('actualizar_producto', async (data) => {
        // Separamos el ID del resto de los datos (nombre, precio)
        const { id, ...productoData } = data;
        
        await productManager.updateProduct(id, productoData);
        
        const productosActualizados = await productManager.getProducts();
        io.emit('productos_actualizados', productosActualizados);
    });

    // =====================================
    // NUEVO: ELIMINAR PRODUCTO
    // =====================================
    socket.on('eliminar_producto', async (id) => {
        await productManager.deleteProduct(id);
        
        const productosActualizados = await productManager.getProducts();
        io.emit('productos_actualizados', productosActualizados);
    });
}