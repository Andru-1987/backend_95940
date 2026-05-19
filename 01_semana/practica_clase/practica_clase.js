/**
 * Hacer una funcion que me reciba (@param) una variable del tipo array
 *
 * - check si el param es un array.
 * - check si esta vacio.
 * - check si el array tiene elementos y mostrar por terminal cada uno de ellos.
 * - retornar (@return) un array con los elementos del tipo numericos, si los tuviera.
 *
 *
 */

planillaTest = {
    numericos: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    general: [],
    objeto: { message: "" },
    mix: [1, {}, () => {}, new Map()],
};

const processArray = (arr) => {
    // check si el param es un array.
    console.log(`[INFO] CHECK Array: ${arr}`);
    if (!Array.isArray(arr)) {
        console.log("El param no es un array");
        return;
    }

    // check si esta vacio.
    console.log(`[INFO] CHECK Array length: ${arr.length}`);
    if (arr.length === 0) {
        console.log("El array esta vacio");
        return;
    }

    // check si el array tiene elementos y mostrar por terminal cada uno de ellos.
    elementosTipoNullish = [null, undefined, "", "$"];

    console.log(`[INFO] CHECK Array elements: ${arr}`);
    arr.forEach((element) => {
        // validamos si el elemento es de tipo nullish (null, undefined, "", "$")
        if (elementosTipoNullish.some((e) => e === element)) {
            console.log(`Elemento nulo o vacio: ${element}`);
            return;
        }

        console.log(element);
    });

    // retornar (@return) un array con los elementos del tipo numericos, si los tuviera.
    console.log(
        `[INFO] CHECK Array numeric elements: ${arr.filter((element) => typeof element === "number")}`,
    );
    return arr.filter((element) => typeof element === "number"); // number[]
};

// for (const key in planillaTest) {
//     console.log(
//         `[INFO] CHECK Key: ${key} ------------------------------------------`,
//     );
//     console.log(`Key: ${key}`);
//     console.log(processArray(planillaTest[key]));
// }

/** -------------------------- */

// Manager -> Gestionar Personas  | Usuarios | Productos | Carritos de Compra
//
// Schema{ Personas  | Usuarios | Productos | Carritos de Compra }
// agregar (CREAR)
// obtener (READ)
// actualizar (UPDATE)
// eliminar (DELETE)
// Entidades : Schemas | Models

const store = []; // ??? on toy?? In Memory -> Base de datos (MongoDB -> Monguito) -> File System

class ModelPersona {
    constructor(nombre, email) {
        this.nombre = nombre;
        this.email = email;
    }

    getInfo() {
        console.log(`[ USER ${this?.id}] Email: ${this.email}`);
    }
}

class Manager {
    static _id = 1;

    constructor() {
        this.store = store;
    }

    /**
     * Un metodo que nos permite observar todos los items que viven en mi STORE (manejado por el manager)
     */
    getAll() {
        console.log(`[INFO] Total items: ${this.store.length}`);
        this.store.forEach((item) => item.getInfo());
    }

    /**
     *
     * @param {*} item
     * La accion de agregar items al store
     */
    add(item) {
        item.id = Manager._id++;
        this.store.push(item);
        console.log(`[INFO] Item added: ${item.id}`);
    }

    getById(id) {
        // filter -> devuelve un array con los items que cumplen con la condicion
        // find -> devuelve el primer item que cumple con la condicion

        const item = this.store.find((item) => item.id === id);

        // check
        if (!item) {
            console.warn(`[WARN] Item not found: ${id}`);
            return null;
        }

        return item;
    }

    deleteById(id) {
        const index = this.store.findIndex((item) => item.id === id);

        if (index === -1) {
            console.warn(`[WARN] Item not found: ${id}`);
            return null;
        }

        // this.store.splice(index, 1);
        //filter siempre te devuelve un array, por eso lo asignamos a this.store
        this.store = this.store.filter((item) => item.id !== id);

        console.log(`[INFO] Item deleted: ${id}`);
        return true;
    }
}

const manager = new Manager();

const andru = new ModelPersona("Andru", "andru@gmail.com");
const felix = new ModelPersona("Felix", "felix@gmail.com");

manager.add(andru);
manager.add(felix);

manager.getAll();

manager.getById(20);

manager.deleteById(2);

manager.getAll();
