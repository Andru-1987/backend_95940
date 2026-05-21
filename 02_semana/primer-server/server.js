import express from "express";

const app = express();
const PORT = 3000;

app.get("/", (request, response) => {
    response.json({ message: "Hello World!" });
});

app.get("/saludo", (request, response) => {
    response.json({ message: "¡Hola!" });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
