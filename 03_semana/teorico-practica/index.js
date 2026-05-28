import { log } from "console";
import express from "express";
const app = express();
import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";

const IP_ADDRESS = "localhost";
const PORT = 3000;

const FILE_PATH = path.join(process.cwd(), "temp", "football_players.csv");
const FILE_PATH_JSON = path.join(process.cwd(), "temp", "sample.json");

app.get("/", (req, res) => {
    res.json({ message: "hola" });
});

//leer un archivo que viva en mi servidor dentro de un recurso /temp
// utilizando el recurso de file system
// primero usando el modulo de manera sincronica -> utilizando callbacks -> utilizando promises
app.get("/temp", (req, res) => {
    //proceso sincrono
    try {
        console.log("leyendo...");
        let data = fs.readFileSync(FILE_PATH, "utf-8");
        console.log(data.toString());

        console.log("escriendo...");
        fs.appendFileSync(
            FILE_PATH,
            "\nLuka,Modric,1985-09-09,mediocampo,diestro,4200000,2",
        );
        data = fs.readFileSync(FILE_PATH, "utf-8");
        console.log("proceso terminado");

        res.status(200).json({ data: data.toString() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/temp-callbacks", (req, res) => {
    //proceso callbacks
    fs.readFile(FILE_PATH, "utf-8", (err, data) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        console.log(data.toString());
        res.status(200).json({ data: data.toString() });
    });

    console.log("Estoy ubicado despues del callback");
});

app.get("/temp-promises", async (req, res) => {
    //proceso promises
    try {
        console.log("leyendo...");
        let data = await fsPromises.readFile(FILE_PATH, "utf-8");
        console.log(data.toString());

        console.log("escriendo...");
        await fsPromises.appendFile(
            FILE_PATH,
            "\nLuka,Modric,1985-09-09,mediocampo,diestro,4200000,2",
        );
        data = await fsPromises.readFile(FILE_PATH, "utf-8");
        console.log("proceso terminado");
        res.status(200).json({ data: data.toString() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/json-parsers", async (req, res) => {
    const data = await fsPromises.readFile(FILE_PATH_JSON, "utf-8");
    const parsedData = JSON.parse(data);

    parsedData["nuevo"] = "SOY UN CAMPO NUEVO";

    await fsPromises.writeFile(
        FILE_PATH_JSON,
        JSON.stringify(parsedData, null, 2),
    );

    res.status(200).json({ data: parsedData });
});

app.listen(PORT, () => {
    console.log(`Server is running on port http://${IP_ADDRESS}:${PORT}`);
});
