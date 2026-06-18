import express from "express";
import { engine } from "express-handlebars";
import http from "http";
import { Server } from "socket.io";

import renderingRouter from "./routers/rendering.router.js";
import registerChatHandler from "./sockets/chatHandler.js";

const app = express();

const server = http.createServer(app);

const io = new Server(server);

// app express -> Nativa usar la creacion servidor http de nodejs -> server de socket io para tener una conexion de websockets

// middleware json
app.use(express.json());

// motor de plantillas
app.engine("handlebars", engine()); //helper no creados aun
app.set("view engine", "handlebars");
app.set("views", "./views");

// router
app.use(renderingRouter);

// health para informar el status de la app
app.get("/health", (req, res) => {
    res.json({ status: "OK" });
});

// ON --> siempre esta escuchando un evento del cliente
io.on("connection", (socket) => {
    console.log(`Se ha conectado el siguiente usuario con id: ${socket?.id}`);

    // registrar el handler del chat
    registerChatHandler(io, socket);

    socket.on("disconnect", () => {
        console.log(`Se ha desconectado el usuario con id: ${socket?.id}`);
    });
});

export default server;
