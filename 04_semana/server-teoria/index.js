import express from "express";

//instanciando o express
const app = express();

//definicion del puert
const port = 3000;

//middleware
app.use(express.json());

app.get("/health", (request, response) => {
    response.send({
        status: "OK",
        message: "Server is running\n" + Date.now().toString(),
    });
});

//params
app.get("/params/:nombre", (request, response) => {
    const { nombre } = request.params;

    console.log(request.params);

    response.send({
        status: "OK",
        message: `El usuario ingreso el siguiente nombre: ${nombre}`,
    });
});

//query-params
app.get("/query/:number", (request, response) => {
    const { number } = request.params;

    const { operacion = "sumar" } = request.query;
    const { valorUno = 0, valorDos = 0 } = request.query;

    let resultado = 0;

    if (operacion === "sumar") {
        resultado = Number(number) + parseInt(valorUno) + parseInt(valorDos);
    } else if (operacion === "restar") {
        resultado = Number(number) - parseInt(valorUno) - parseInt(valorDos);
    }

    console.log(request.query);

    response.send({
        status: "OK",
        message: `El resultado de la operacion es: ${resultado}`,
    });
});

// body
app.post("/body", (request, response) => {
    const {
        number,
        operacion = "sumar",
        valorUno = 0,
        valorDos = 0,
    } = request.body;

    console.log(request.body);

    let resultado = 0;

    if (operacion === "sumar") {
        resultado = Number(number) + parseInt(valorUno) + parseInt(valorDos);
    } else if (operacion === "restar") {
        resultado = Number(number) - parseInt(valorUno) - parseInt(valorDos);
    } else {
        response.status(404).send({
            status: "ERROR",
            message: `Operacion no encontrada`,
        });
        return;
    }

    response.status(201).send({
        status: "OK",
        message: `Post enviado por medio de JSON`,
        resultado: resultado,
    });
});

//defiminos la escucha del servidor
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
