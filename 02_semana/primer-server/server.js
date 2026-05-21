import express from "express";
import { router as userRouter } from "./src/routes/user.routes.js";

const app = express();
const PORT = 3000;

app.get("/", (request, response) => {
    response.json({ message: "Hello World!" });
});

app.get("/saludo", (request, response) => {
    response.json({ message: "¡Hola!" });
});

app.use("/users", userRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
