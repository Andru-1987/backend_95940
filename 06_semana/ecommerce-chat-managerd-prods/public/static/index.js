const socket = io();

socket.on("chatHistory", (data) => {
    const chatHistory = document.getElementById("chat-box");

    console.log(data);

    data.forEach((message) => {
        const messageElement = document.createElement("div");
        messageElement.textContent = `${message.usuario}: ${message.message}`;
        chatHistory.appendChild(messageElement);
    });

    chatHistory.scrollTop = chatHistory.scrollHeight;
});

socket.on("userJoined", (data) => {
    console.log(data);
});

const send = document.getElementById("send-btn");

if (send) {
    send.addEventListener("click", () => {
        const message = document.getElementById("message").value;
        const username = document.getElementById("username").value;

        if (message) {
            socket.emit("message_client", { message, username });
            message.value = "";
        }
    });
}

const chat = document.getElementById("chat-box");

const addMessage = (message) => {
    chat.innerHTML += `<div>${message}</div>`;
    chat.scrollTop = chat.scrollHeight;
};

socket.on("message_server", (data) => {
    addMessage(`${data.username}: ${data.message}`);
});

// falta agregar productos!
