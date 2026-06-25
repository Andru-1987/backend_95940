## Clase de Backend: Introducción y Fundamentos de MongoDB

El propósito de esta clase es abordar las limitaciones de los sistemas de archivos tradicionales para la persistencia de datos y comprender la arquitectura, ventajas y operaciones fundamentales de MongoDB como solución orientada a documentos dentro del paradigma NoSQL.

> [MongoDB CheatSheet](https://gist.github.com/bradtraversy/f407d642bdc3b31681bc7e56d95485b6)

---

## 1. El Problema de la Persistencia en FileSystem y la Necesidad de una Base de Datos

En el desarrollo de aplicaciones globales, el almacenamiento directo en el sistema de archivos (**FileSystem**) presenta restricciones críticas que impiden la escalabilidad:

* **Actualización ineficiente:** Modificar un único registro exige la reescritura completa del archivo contenedor, generando un alto costo de Entrada/Salida (I/O).
* **Lectura ineficiente:** La búsqueda de datos no indexados requiere un recorrido secuencial (línea por línea) desde el inicio del archivo, lo cual es inviable con volúmenes masivos de información.
* **Ausencia de protección nativa:** Carece de mecanismos para prevenir la corrupción de datos o gestionar de forma segura los accesos concurrentes de múltiples usuarios.

Por estas razones, se define una **Base de Datos (BD)** como una recopilación organizada de datos estructurados dentro de un mismo contexto. Su función se restringe estrictamente al almacenamiento seguro, la segmentación contextual y la gestión simplificada (filtrado, ordenamiento y actualización), delegando el procesamiento posterior de la información a la capa lógica de la aplicación.

---

## 2. Modelos de Persistencia: Relacional (SQL) frente a No Relacional (NoSQL)

La elección del motor de persistencia depende de los requerimientos de consistencia y escalabilidad del sistema:

| Característica | Modelo Relacional (SQL) | Modelo No Relacional (NoSQL) |
| --- | --- | --- |
| **Estructura** | Firme, estricta y definida mediante esquemas (tablas, filas, columnas). | Flexible y dinámica (documentos, clave-valor, grafos). |
| **Relaciones** | Formales, basadas en llaves primarias y foráneas. | Flexibles, dinámicas o embebidas dentro del mismo objeto. |
| **Lenguaje** | SQL (Structured Query Language). | Sintaxis propia dependiente del sistema de gestión seleccionado. |
| **Escalabilidad** | Esencialmente vertical (incremento de hardware en un solo servidor). | Horizontal (distribución de carga nativa en múltiples servidores). |
| **Casos de uso** | Sistemas bancarios o de contabilidad donde la consistencia inmediata es crítica. | Aplicaciones modernas con alta movilidad, datos no estructurados o picos masivos de uso. |

MongoDB se clasifica dentro del modelo NoSQL orientado a documentos. Almacena la información en formato **BSON** (una extensión binaria de JSON), organizando los registros en **Colecciones**, las cuales actúan como equivalentes conceptuales a las tablas de SQL pero sin la obligatoriedad de un esquema rígido.

---

## 3. Implementación Práctica: Operaciones CRUD y Operadores de Consulta

La manipulación de los datos en MongoDB se realiza mediante el acrónimo fundamental **CRUD** (Create, Read, Update, Delete). A continuación, se detallan los métodos y la aplicación de los operadores lógicos y de comparación descritos en el marco teórico.

### 3.1. Create (Inserción de Documentos)

Para registrar nuevos documentos dentro de una colección, se emplean instrucciones como `insertOne()` o `insertMany()`.

```javascript
db.usuarios.insertOne({
  nombre: "Carlos",
  edad: 28,
  activo: true,
  hobbies: ["Lectura", "Investigación"]
})

```

### 3.2. Read (Consulta y Operadores de Filtro)

La selección de información aprovecha los operadores de consulta (`Query Operators`) para estructurar criterios complejos.

* **Operadores de Comparación (`$gte`, `$lt`):**

```javascript
// Recuperar documentos donde la edad sea mayor o igual a 18 años
db.usuarios.find({ edad: { $gte: 18 } })

```

* **Operadores Lógicos (`$or`, `$and`):**

```javascript
// Buscar registros que coincidan con el nombre "Carlos" O cuya edad sea menor a 20 años
db.usuarios.find({
  $or: [
    { nombre: "Carlos" },
    { edad: { $lt: 20 } }
  ]
})

```

### 3.3. Update (Modificación de Campos)

La actualización optimizada no reemplaza el documento, sino que altera campos específicos mediante los `Update Operators`.

* **`$set`:** Asigna un valor a un campo o lo crea si este no existe.
* **`$inc`:** Incrementa o decrementa un valor numérico de forma atómica.

```javascript
// Localiza el registro y modifica el estado lógico e incrementa la edad en una unidad
db.usuarios.updateOne(
  { nombre: "Carlos" }, 
  { 
    $inc: { edad: 1 },
    $set: { activo: false }
  }
)

```

### 3.4. Delete (Eliminación de Registros)

Remueve documentos que cumplan con un criterio específico a través de `deleteOne()` o `deleteMany()`.

```javascript
// Remueve el primer documento que coincida con la condición de inactividad
db.usuarios.deleteOne({ activo: false })

```

---

## 4. Gestión del Flujo de Datos: Proyecciones y Paginación

Para optimizar el rendimiento de la red y la memoria del servidor, MongoDB permite controlar con precisión qué datos se transfieren.

* **Proyección:** Especifica los campos devueltos en la consulta (1 para incluir, 0 para excluir).
```javascript
// Retorna únicamente los campos nombre y email, omitiendo el identificador por defecto (_id)
db.usuarios.find({}, { nombre: 1, email: 1, _id: 0 })

```


* **Paginación (`Sort`, `Skip`, `Limit`):** Estructura la segmentación de grandes conjuntos de datos para su visualización progresiva.
```javascript
db.usuarios.find()
  .sort({ edad: -1 }) // Ordenamiento descendente por edad
  .skip(10)           // Omisión de los primeros 10 documentos
  .limit(5)           // Restricción del resultado a un máximo de 5 documentos

```



> **Nota técnica:** Independientemente del orden sintáctico en el que se invoquen los métodos en el código, el motor de MongoDB ejecuta internamente las fases en la secuencia lógica: `Sort` (Ordenamiento), `Skip` (Salto) y finalmente `Limit` (Límite), garantizando la consistencia del resultado.

---

Para profundizar en la aplicación práctica de estos conceptos, ¿cuál es el caso de uso empresarial o el modelo de negocio específico que desea estructurar bajo este paradigma NoSQL?