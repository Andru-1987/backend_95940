import { Router } from "express";
import { usuarios } from "../database/users.memory.js";

const router = Router();

router.get("/", (request, response) => {
    response.json({ message: "soy del metodo GET" });
});

router.post("/", (request, response) => {
    response.json(usuarios);
});

router.get("/despedida", (request, response) => {
    response.json({ message: "soy del metodo GET ->  despedida" });
});

export { router };
