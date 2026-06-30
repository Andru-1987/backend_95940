# Guía Práctica de Backend: MongoDB Compass y Operaciones CRUD

## Objetivos de la Práctica

Al finalizar esta guía, serás capaz de:

* Comprender la estructura de un documento JSON.
* Crear bases de datos y colecciones utilizando MongoDB Compass.
* Insertar documentos individuales y múltiples (Create).
* Consultar información utilizando filtros, proyecciones y ordenamiento (Read).
* Modificar documentos existentes mediante operadores (Update).
* Eliminar documentos de forma condicional (Delete).
* Comprender la flexibilidad del esquema (Schema-less) de MongoDB.

---

## Parte 1: Preparación del Dataset

Antes de trabajar con MongoDB, necesitamos preparar la información inicial que vamos a almacenar.

**Paso 1:** Crea un archivo en tu computadora llamado `clientes.json` y copia el siguiente contenido:

```json
[
    {
        "nombre": "Juan",
        "apellido": "Pérez",
        "edad": 22,
        "email": "juan@gmail.com",
        "ciudad": "Buenos Aires",
        "activo": true
    },
    {
        "nombre": "Lucía",
        "apellido": "Martinez",
        "edad": 25,
        "email": "lucia@gmail.com",
        "ciudad": "Rosario",
        "activo": true
    },
    {
        "nombre": "Pedro",
        "apellido": "Lopez",
        "edad": 35,
        "email": "pedro@gmail.com",
        "ciudad": "Córdoba",
        "activo": false
    },
    {
        "nombre": "María",
        "apellido": "Fernandez",
        "edad": 29,
        "email": "maria@gmail.com",
        "ciudad": "Mendoza",
        "activo": true
    },
    {
        "nombre": "Sofía",
        "apellido": "Gomez",
        "edad": 19,
        "email": "sofia@gmail.com",
        "ciudad": "La Plata",
        "activo": false
    }
]

```

> **¿Qué representa este archivo?**
> Cada objeto dentro del arreglo representa un cliente. Como puedes observar, cada uno posee los atributos: `nombre`, `apellido`, `edad`, `email`, `ciudad` y `activo`. Este archivo será nuestro conjunto de datos base para los siguientes ejercicios.

---

## Parte 2: Crear la Base de Datos

1. Abre **MongoDB Compass**.
2. Conéctate a tu servidor en la nube: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) utilizando la URI:
```bash
    # MongoDB Compass
    mongodb+srv://<username>:<db_password>@<cluster_name>.mongodb.net/
```

3. Crea una nueva base de datos llamada **`backend`**.
4. Dentro de esa base de datos, crea una colección llamada **`clientes`**.

---

## Parte 3: Primera Inserción (Create)

Comenzaremos a poblar nuestra base de datos. Utiliza la interfaz de Compass para realizar las siguientes acciones:

* **Ejercicio 1:** Inserta **únicamente el primer cliente** (Juan) utilizando la opción *Insert Document*.
* **Ejercicio 2:** Inserta los **cuatro clientes restantes** de una sola vez. Al finalizar, tu colección debe contener exactamente 5 documentos.
* **Ejercicio 3:** Agrega un nuevo cliente de forma manual con los siguientes datos:
```json
{
    "nombre": "Carlos",
    "apellido": "Ruiz",
    "edad": 40,
    "email": "carlos@gmail.com",
    "ciudad": "Salta",
    "activo": true
}

```


* **Ejercicio 4:** Agrega un cliente que incluya un **nuevo atributo**:
```json
{
    "nombre": "Ana",
    "apellido": "Suarez",
    "edad": 28,
    "email": "ana@gmail.com",
    "ciudad": "Neuquén",
    "activo": true,
    "telefono": "2991112233"
}

```



> **Pregunta de análisis:** ¿Por qué MongoDB permite guardar el documento de Ana, aunque los documentos anteriores no tengan el atributo `telefono`?

---

## Parte 4: Consultas (Read)

Una vez cargada la información (deberías tener 7 documentos), utiliza la barra de filtros de Compass para realizar las siguientes búsquedas:

* **Ejercicio 1:** Mostrar todos los documentos (Asegúrate de ver los 7 resultados).
* **Ejercicio 2:** Buscar solamente los clientes activos. *(Filtro: `{"activo": true}`)*.
* **Ejercicio 3:** Buscar únicamente los clientes inactivos.
* **Ejercicio 4:** Buscar los clientes **mayores de 25 años**. *(Pista: Investiga y utiliza operadores de comparación como `$gt`)*.
* **Ejercicio 5:** Buscar clientes cuya edad esté **entre 20 y 30 años**.
* **Ejercicio 6:** Buscar únicamente los clientes de la ciudad de Rosario.
* **Ejercicio 7:** Buscar los clientes de Rosario que, además, estén activos.
* **Ejercicio 8:** Mostrar **solamente** los campos `nombre` y `email`. *(Pista: Utiliza el campo **Project**)*.
* **Ejercicio 9:** Ordenar los clientes por edad, del mayor al menor. *(Pista: Utiliza el campo **Sort**)*.
* **Ejercicio 10:** Mostrar únicamente los **tres clientes más jóvenes**. *(Pista: Combina **Sort** y **Limit**)*.
* **Ejercicio 11:** Mostrar al **segundo cliente más joven**. *(Pista: Combina **Sort**, **Skip** y **Limit**)*.

---

## Parte 5: Actualización (Update)

Modificaremos la información existente utilizando las herramientas de edición y actualización masiva.

* **Ejercicio 1:** Cambia la ciudad de Juan por "Mar del Plata" (Utiliza la opción visual *Edit Document*).
* **Ejercicio 2:** Actualiza el email de Lucía utilizando el operador `$set`.
* **Ejercicio 3:** Incrementa en 1 la edad de Pedro utilizando el operador `$inc`.
* **Ejercicio 4:** Agrega el atributo `"premium": true` al documento de María.
* **Ejercicio 5:** Elimina el atributo `telefono` del documento de Ana utilizando el operador `$unset`.
* **Ejercicio 6:** Cambia el nombre del atributo `ciudad` por `localidad` en cualquier documento utilizando `$rename`.
* **Ejercicio 7:** A todos los clientes que estén activos, agrégales el atributo `"descuento": true`. *(Pista: Utiliza la consola inferior o la opción **Update Many**)*.
* **Ejercicio 8:** Haz que todos los clientes menores de 21 años pasen a estar activos. *(Utiliza **Update Many**)*.

---

## Parte 6: Eliminación (Delete)

* **Ejercicio 1:** Elimina al cliente llamado Carlos.
* **Ejercicio 2:** Elimina a **todos** los clientes inactivos.
* **Ejercicio 3:** Elimina a **todos** los clientes menores de 20 años.
* **Ejercicio 4:** Elimina a **todos** los clientes cuyo email pertenezca al dominio `hotmail.com`. *(Pista: Investiga cómo usar expresiones regulares o el operador `$regex` en los filtros)*.

---

## Parte 7: Desafíos Integradores

Demuestra todo lo aprendido resolviendo estos casos complejos:

1. **Desafío 1:** Agrega **cinco clientes nuevos** de una sola vez, enviando un único arreglo JSON en Compass.
2. **Desafío 2:** Realiza una consulta que traiga a los clientes **activos**, que sean **mayores de 25 años**, ordenados de **mayor a menor** por edad, y que la respuesta **solo muestre** el `nombre` y la `ciudad`.
3. **Desafío 3:** Encuentra a todos los clientes de Córdoba y, en la misma operación, incrementa su edad en dos años.
4. **Desafío 4:** Elimina a todos los clientes que tengan el atributo `premium` establecido en `false`.

---

## Parte 8: Comprendiendo el Modelo Flexible

Inserta el siguiente documento en tu colección:

```json
{
    "nombre": "Administrador",
    "permisos": [
        "crear",
        "editar",
        "eliminar"
    ]
}

```

**Responde las siguientes preguntas para debatir en clase:**

1. ¿Por qué MongoDB acepta este documento si su estructura es radicalmente diferente a la de un "Cliente"?
2. ¿Qué ventajas ofrece esta flexibilidad frente a una base de datos SQL (relacional) tradicional?
3. ¿En qué situaciones esta flexibilidad podría convertirse en una desventaja o generar un problema en el Backend?

---
