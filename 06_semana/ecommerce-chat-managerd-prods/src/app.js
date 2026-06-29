import express from "express";

// socket -> server nativo http de nodejs
import http from "http";
import { Server } from "socket.io";

// renderizar las peticiones y/o vistas chat y el manager de productos
import { engine } from "express-handlebars";

// modulos custom de la app
import renderingRouter from "./routes/rendering.route.js";
import chatHandler from "./sockets/chatHandler.js";
import registerProductHandler from "./sockets/productsHandler.js";

const app = express();

const server = http.createServer(app);
const io = new Server(server);

// servicio de statics
app.use(express.static("public"));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "views");

app.use("/", renderingRouter);

// TODO: io
//
io.on("connection", (socket) => {
    console.log("cliente conectado", socket.id);

    chatHandler(io, socket);
    registerProductHandler(io, socket);

    socket.on("disconnect", () => {
        console.log("cliente desconectado", socket.id);
    });
});

export default server;
