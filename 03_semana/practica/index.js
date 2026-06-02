import express from "express";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import UserModel from "./src/models/users.models.js";
import { readUsers, saveUsers } from "./src/services/users.services.js";

const ARCHIVO_NUMEROS_ALEATORIOS = path.join(
    process.cwd(),
    "datastore",
    "datastore.txt",
);

const JSON_FILE = path.join(process.cwd(), "datastore", "users.json");

const app = express();
const PORT = process.env.PORT || 3000; // por default siempre va a ser el 3000

// que interprete el body como JSON
app.use(express.json());

app.get("/health", (request, response) => {
    response.send("OK");
});

// Crear un archivo /datastore -> archivo con numeros aleatorios del 1-20 y la cantidad que sean 10K

app.post("/datastore", async (request, response) => {
    // validar que el archivo existe | si no existe, crearlo
    // funcion que genere los nums y lo guarde en la memoria

    const numerosAleatorios = Array.from(
        { length: 10000 },
        () => Math.floor(Math.random() * 20) + 1,
    );

    // esos valores guardarlos en el archivo

    try {
        await fs.writeFile(
            ARCHIVO_NUMEROS_ALEATORIOS,
            numerosAleatorios.join("\n"),
            "utf-8",
        );

        console.log("Archivo creado exitosamente");
        response.status(201).send("Archivo creado exitosamente");
    } catch (error) {
        console.error("Error al escribir en el archivo:", error);
        response.status(500).send("Error al escribir en el archivo");
        return;
    }
});

/**
 * Crear una ruta donde me permita crear usuarios
 * POSTS /users
 *
 * {
 *  "name": "",
 *  "lastName": "",
 *  "email": "",
 *  "password": ""
 * }
 *
 * que encrypte la contraseña usando crypto y guarde el usuario en la base de datos
 *
 * Hay que crear un Manager que se encargue de la logica de negocio(de gestionar la creacion de usuarios)
 *
 * creacion de manera manual > (POST /users) usando json request.body con toda la data
 *
 * archivo json /datastore/users.json
 */

app.post("/users", async (request, response) => {
    // pasarlo a un proyecto modular usando Managers

    // creacion del usuario
    const user = new UserModel(request.body);

    //guardar el usuario en el archivo json
    const usuarios = await readUsers(JSON_FILE);
    usuarios.push(user);

    await saveUsers(JSON_FILE, usuarios);
    response.status(201).send("El usuario fue creado");
});

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
