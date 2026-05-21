import { sumar } from "./src/math.modules.js";

// args -> parametros a mi sistema por medio de unas declaraciones fuera del script -> node index.js --operacion=sumar --a=2 --b=2

// const personas = {
//     nombre: "pepe",
//     apellido: "x",
//     email: "persona@mail.com",
// };

// const email = personas.email;
// console.log(email);

// const { email: email2 } = personas;
// console.log(email2);

//callback
const calculadora = (operacionCallBack, a, b) => {
    return operacionCallBack(a, b);
};

function main() {
    console.log("Bienvenido a la calculadora de Backend CoderHouse 95940");

    while (true) {
        console.log(
            "Ingrese una operación (sumar, restar, multiplicar, dividir) o 'salir' para terminar:",
        );

        const a = 2;
        const b = 2;

        const operacion = "sumar"; //prompt("Operación: \n");

        switch (operacion) {
            case "sumar":
                const resultado = calculadora(sumar, a, b);
                console.log(resultado);
                break;
            case "restar":
                break;
            case "multiplicar":
                break;
            case "dividir":
                break;

            case "salir":
                console.log("Gracias por usar la calculadora.");
                break;

            default:
                console.log("Operación no válida.");
                break;
        }
    }
}

main();
