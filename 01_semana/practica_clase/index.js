// esto me permite crear un mensaje por terminal
/*esto es otro tipo de comentario en bloque*/

console.log("[LOG] hola mundo desde Js");
console.error("[ERROR] esto es un error");

// asigancion de variables
//
// let
// const
// var

let nombre = "Juan"; // String
const edad = 30; // Number
var apellido = "Perez"; // String

{
    let nombre = "Pedro"; // String
}

console.log(nombre);

{
    var apellido = "Gomez";
}

console.log(apellido);

// edad = "31"; // String

console.log(edad);

const paises = ["Argentina", "Brasil", "Chile", "Uruguay"];

console.log(paises);

paises.push("China");

console.log(paises);

// functions -->
/**Esta funcion define el comportamiento de saludar
 * el parametro - {tipo de dato} - descripcion
 * @param {string} nombre : default:"Invitado" - El nombre del usuario a saludar
 * @returns {void} - No retorna nada --> retorno implicito -> null
 */
function saludar(nombre = "Invitado") {
    console.log(`Hola ${nombre}`);
}

saludar();

const greet = (nombre = "Invitado") => {
    console.log(`Hola ${nombre} -> desde una funcion flecha`);
};

// como hago para crear un objeto nuevo con una funcionalidad (metodo) especifico

// objeto es una instancia de una clase
const personaJuan = {
    nombre: "Juan",
    edad: 30,
    saludar: () => {
        console.log(`Hola ${personaJuan.nombre}`);
    },
}; // es un objeto literal

personaJuan.saludar();

// creacion de una clase
// es una plantilla para crear objetos
// self

class Persona {
    constructor(nombre, edad) {
        this.nombre = nombre;
        this.edad = edad;
    }

    saludar() {
        console.log(`Hola ${this.nombre}`);
    }
}

const personaPedro = new Persona("Pedro", 35);
personaPedro.saludar();

class Contador {
    // Metodos de instancia del contador staticas

    static contadorGlobal = 0;

    constructor() {
        // inicializador de instancia
        this.contador = 10;
    }

    incrementar() {
        this.contador++;
    }

    decrementar() {
        this.contador--;
    }

    obtenerValor() {
        return this.contador;
    }

    static incrementarGlobal() {
        Contador.contadorGlobal++;
    }

    static obtenerValorGlobal() {
        return Contador.contadorGlobal;
    }
}

const contador = new Contador();

contador.incrementar();
contador.incrementar();

Contador.incrementarGlobal();

console.log(contador.obtenerValor());
console.log(Contador.obtenerValorGlobal());

const contadorDos = new Contador();

contadorDos.incrementar();

console.log(contadorDos.obtenerValor());
console.log(Contador.obtenerValorGlobal());

// callbacks | Funciones como ciudadanos de primera clase

// calculadora simple
const operaciones = {
    sumar: (a, b) => a + b,
    restar: (a, b) => a - b,
    multiplicar: (a, b) => a * b,
    dividir: (a, b) => a / b,
};

//callback
const calculadora = (operacionCallBack, a, b) => {
    return operacionCallBack(a, b);
};

const resultaDeSuma = calculadora(operaciones.sumar, 1, 9);

console.log(resultaDeSuma);

// vamos a hace una llamada a una api
//
//  URL -> https://dragonball-api.com/api/characters

const apiUrl = "https://dragonball-api.com/api/characters";

//promesa que me devuelve una llamada a una api publica
fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
        // mostramos los datos en la consola
        console.log(data);
    })
    .catch((error) => {
        console.error(error.message);
    });

console.log(">>>> Debo aparecer despues del fetch");

// Control de flujo y condicionales
//
//
// Saber que una fecha pertenece a un año bisiesto
//
//

const esBisiesto = (year) => {
    const primeraCondicion = year % 400 === 0;
    const segundaCondicion = year % 4 === 0 && year % 100 !== 0;
    return primeraCondicion || segundaCondicion;
};

const isLeapYear = (year) =>
    year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0);

const leapYear = [
    2000, 2004, 2001, 2008, 2012, 2016, 2020, 2024, 2028, 2032, 2036, 2040,
    2044, 2048,
];

leapYear.forEach((year) => {
    isLeapYear(year)
        ? console.log(`[LOG] ${year} es bisiesto`)
        : console.log(`[LOG - NEGATIVO] ${year} no es bisiesto`);
});
