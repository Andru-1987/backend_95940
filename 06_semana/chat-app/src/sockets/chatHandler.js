let chatHistory = [
    {
        id: "I24_6mn2HDRdQ900AAAB",
        usuario: "pirulo",
        texto: "Hola soy un zapallo",
        fecha: new Date(),
    },
];

const registerChatHandler = (io, socket) => {
    socket.emit("historial_chat", chatHistory);

    // el cliente envio un emit
    // el servidor recibe el emit y emite un evento a todos los clientes
    socket.on("mensaje", (data) => {
        const newMessage = {
            id: socket?.id,
            ...data,
        };

        chatHistory.push(newMessage);

        io.emit("mensaje_server", newMessage);
    });
};

export default registerChatHandler;
