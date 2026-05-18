# Unidad 02 — ECMAScript Moderno

# Objetivos

- Comprender ES6+
- Utilizar sintaxis moderna
- Entender scope y variables
- Trabajar con clases y objetos
- Aplicar buenas prácticas backend

---

# ECMAScript

| Concepto | Descripción |
|---|---|
| ECMAScript | Estándar de JavaScript |
| ES6 | Versión moderna más importante |
| Objetivo | Mejorar legibilidad y mantenimiento |

---

# Variables

| Tipo | Reasignable | Scope |
|---|---|---|
| var | Sí | Global/función |
| let | Sí | Bloque |
| const | No | Bloque |

## Ejemplo

```js
let edad = 20
edad = 21

const nombre = "Anderson"
```

---

# Scope

Define dónde puede utilizarse una variable.

## Tipos

| Scope | Alcance |
|---|---|
| Global | Todo el archivo |
| Local | Función o bloque |

## Ejemplo

```js
const mensaje = "Hola"

function saludar() {
    console.log(mensaje)
}
```

---

# Tipos de datos

## Primitivos

| Tipo | Ejemplo |
|---|---|
| String | `"Hola"` |
| Number | `10` |
| Boolean | `true` |
| Null | `null` |
| Undefined | `undefined` |

---

## Objetos

| Tipo | Ejemplo |
|---|---|
| Object | `{ nombre: "Juan" }` |
| Array | `[1,2,3]` |
| Function | `() => {}` |

---

# Funciones

## Tradicional

```js
function sumar(a, b) {
    return a + b
}
```

---

## Arrow Function

```js
const sumar = (a, b) => a + b
```

---

# Template Strings

Permiten insertar variables fácilmente.

```js
const nombre = "Anderson"

console.log(`Hola ${nombre}`)
```

---

# Spread Operator

Permite copiar o expandir datos.

## Arrays

```js
const total = [...a, ...b]
```

## Objetos

```js
const user = {
    ...usuario,
    edad: 30
}
```

---

# Rest Operator

Agrupa múltiples parámetros.

```js
function suma(...numeros) {
    return numeros
}
```

---

# Nullish Coalescing

Asigna valores por defecto.

```js
const edad = null

const resultado = edad ?? 18
```

---

# Clases

Permiten modelar entidades.

```js
class User {

    constructor(nombre) {
        this.nombre = nombre
    }
}
```

---

# Variables privadas

```js
class Cuenta {

    #saldo = 0
}
```

---

# Variables estáticas

```js
class Contador {

    static global = 0
}
```

---

# Closures

Funciones que recuerdan variables internas.

```js
function contador() {

    let valor = 0

    return () => valor++
}
```

---

# Diagrama — Scope

```text
GLOBAL
│
├── variableGlobal
│
└── function()
     │
     ├── variableLocal
     │
     └── bloque if
          └── variableBloque
```

---

# Diagrama — Clase

```text
Clase User
│
├── propiedades
│    ├── nombre
│    └── email
│
└── métodos
     ├── login()
     └── logout()
```

---

# Buenas prácticas

| Recomendación | Motivo |
|---|---|
| Usar const por defecto | Evita errores |
| Evitar var | Problemas de scope |
| Preferir arrow functions | Código moderno |
| Utilizar template strings | Mejor legibilidad |
| Modelar con clases | Organización |

---

# Conceptos importantes para backend

- Objetos
- Arrays
- Clases
- Métodos
- Validaciones
- Datos en memoria
- Modularización
