import {Router} from "express"
import ProductManager from '../manager/ProductManager.js'

const renderingRouter = Router()
const productManager = new ProductManager();

renderingRouter.get("/", (req,res) => res.render('landing',{title: 'Inicio - Arquitectura WebSockets'}))

// Ruta para la sala de chat
renderingRouter.get('/chat', (req, res) => {
    // Renderizamos la vista 'chat.handlebars'
    res.render('chat', { title: 'Sala de Chat en Vivo' });
});


// Ruta para los productos refactorizada
renderingRouter.get('/productos', async (req, res) => {
    try {
        // Toda la lógica pesada desaparece. Solo le pedimos los datos al manager.
        const productos = await productManager.getProducts();

        // Renderizamos la vista y le inyectamos los productos iniciales
        res.render('products', { 
            title: 'Catálogo de Productos',
            productos: productos 
        });
    } catch (error) {
        console.error("Error al cargar la vista de productos:", error);
        // Buena práctica: si el manager falla por algún motivo, 
        // renderizamos la página igual pero con un array vacío para no romper la web.
        res.render('products', { 
            title: 'Catálogo de Productos',
            productos: [] 
        });
    }
});

export default  renderingRouter