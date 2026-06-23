let history = [];

const chatHandler = (io, socket) => {
    //server se encarga de emitir el historial al cliente
    socket.emit("chatHistory", history);

    // el server se encarga de avisar de que un usuario entro al chat
    socket.broadcast.emit("userJoined", { userId: socket.id });

    // el server se encarga de estar escuchando cuando envian mensajes
    //
    socket.on("message_client", (data) => {
        const newMessage = {
            userId: socket.id,
            usuario: data.username || "Anonimux",
            message: data.message,
            timestamp: new Date().toISOString(),
        };
        history.push(newMessage);

        io.emit("message_server", newMessage);
    });
};

export default chatHandler;
