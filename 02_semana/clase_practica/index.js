// importar las libreas necesarias para express -> generar el servidor
import express from "express";
import usersRouter from "./src/routes/users.router.js";

// crear una instancia de express
const app = express();
const PREFIX_API = "/api";
const VERSION = "v1";

// la ruta a donde va estar escuchando --> la ruta raiz
// cuando se accede a la ruta raiz, se ejecuta la funcion callback
// Verbo HTTP: GET
// async - await
app.use(`${PREFIX_API}/${VERSION}/users`, usersRouter);

// el arranque del servidor
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
