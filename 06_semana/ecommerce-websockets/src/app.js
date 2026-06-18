import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import renderingRouter from "./routes/rendering.routes.js"
import {engine} from 'express-handlebars'

// Importamos nuestros manejadores modulares para separar la lógica de negocio
import registerChatHandlers from './sockets/chatHandler.js';
import registerProductHandlers from './sockets/productsHandler.js';

// ========================================================
// INICIALIZACIÓN DE LA INFRAESTRUCTURA DEL SERVIDOR
// ========================================================

// 1. Instanciamos Express para manejar rutas HTTP y archivos estáticos.
const app = express();

// 2. Creamos un servidor HTTP nativo de Node.js y le pasamos la app de Express.
// Esto es necesario porque Socket.IO requiere acoplarse al servidor HTTP base, 
// no a la abstracción de Express.
const server = http.createServer(app);

// 3. Inicializamos Socket.IO montándolo sobre el servidor HTTP.
// Ahora, el 'server' puede responder tanto a peticiones HTTP normales 
// como a conexiones WebSocket en el mismo puerto.
const io = new Server(server);

// ========================================================
// MIDDLEWARES DE EXPRESS
// ========================================================
// Le decimos a Express que sirva los archivos de la carpeta 'public'
// de forma estática (HTML, CSS, JS del cliente).
app.use(express.static( 'public'));


// ========================================================
// CONFIGURACIÓN DE HANDLEBARS
// ========================================================
// 1. Definimos el motor de plantillas
app.engine('handlebars', engine());

// 2. Le decimos a Express que el motor de vistas a usar es Handlebars
app.set('view engine', 'handlebars');

// 3. Le indicamos a Express dónde están físicamente las vistas
app.set('views', 'views');


app.use("/", renderingRouter)


// ========================================================
// LÓGICA DE WEBSOCKETS (MODULAR)
// ========================================================
// El evento 'connection' se dispara cada vez que un cliente (navegador)
// completa el handshake (apretón de manos) exitosamente.
io.on('connection', (socket) => {
    // 'socket' representa la conexión individual y única con ese cliente específico.
    // 'socket.id' es un identificador alfanumérico único generado automáticamente.
    console.log(`Cliente conectado con ID: ${socket.id}`);

    // Delegamos la lógica específica a nuestros módulos, pasándoles
    // la instancia global (io) y la conexión particular (socket).
    registerChatHandlers(io, socket);
    registerProductHandlers(io, socket);

    // Escuchamos el evento de desconexión (cuando el usuario cierra la pestaña
    // o pierde la conexión a internet).
    socket.on('disconnect', () => {
        console.log(`Cliente desconectado: ${socket.id}`);
    });
});


// IMPORTANTE: Hacemos listen sobre 'server' (el servidor HTTP nativo), 
// NO sobre 'app' (Express). Si hacemos app.listen(), WebSockets no funcionará.
export default server