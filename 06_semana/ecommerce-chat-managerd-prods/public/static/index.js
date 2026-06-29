const socket = io();

socket.on("chatHistory", (data) => {
    const chatHistory = document.getElementById("chat-box");

    console.log(data);

    data.forEach((message) => {
        const messageElement = document.createElement("div");
        messageElement.textContent = `${message.usuario}: ${message.message}`;
        chatHistory.appendChild(messageElement);
    });

    // chatHistory.scrollTop = chatHistory.scrollHeight;
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
const addProductListener = document.getElementById("add-btn");

const clearForm = () => {
    document.getElementById("prod-title").value = "";
    document.getElementById("prod-description").value = "";
    document.getElementById("prod-code").value = "";
    document.getElementById("prod-price").value = "";
    document.getElementById("prod-status").checked = false;
    document.getElementById("prod-stock").value = "";
    document.getElementById("prod-category").value = "";
};

if (addProductListener) {
    addProductListener.addEventListener("click", () => {
        title = document.getElementById("prod-title").value.trim();
        description = document.getElementById("prod-description").value.trim();
        code = document.getElementById("prod-code").value.trim();
        price = document.getElementById("prod-price").value.trim();
        status = document.getElementById("prod-status").checked;
        stock = Number(document.getElementById("prod-stock").value.trim());
        category = document.getElementById("prod-category").value.trim();

        if (title && description && code && price && stock && category) {
            const product = {
                title,
                description,
                code,
                price,
                status,
                stock,
                category,
            };
            console.log(product);
            socket.emit("add_product", product);
        }
        clearForm();
    });
}

socket.on("products_updated", (products) => {
    const productList = document.getElementById("lista-productos");
    productList.innerHTML = "";

    products.forEach((product) => {
        const li = document.createElement("li");

        li.innerHTML = `
            <div class="product-info">
                <strong>${product.title}</strong> - $${product.price} <br>
                <small style="color: #666;">(ID: ${product.id})</small>
            </div>
            <div class="product-actions">
                <button class="btn-edit" data-id="${product.id}" data-title="${product.title}" data-price="${product.price}">✏️ Editar</button>
                <button class="btn-delete" data-id="${product.id}">🗑️ Borrar</button>
            </div>
        </li>
        `;
        productList.appendChild(li);
    });
});
