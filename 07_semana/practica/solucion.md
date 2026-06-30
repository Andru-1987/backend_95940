# Código de Resolución: Operaciones CRUD en MongoDB

## Parte 2: Crear la Base de Datos y Colección

Para seleccionar o crear la base de datos y comenzar a trabajar en ella:

```javascript
use backend

```

## Parte 3: Primera Inserción (Create)

**Ejercicio 1: Insertar únicamente el primer cliente**

```javascript
db.clientes.insertOne({
    "nombre": "Juan",
    "apellido": "Pérez",
    "edad": 22,
    "email": "juan@gmail.com",
    "ciudad": "Buenos Aires",
    "activo": true
})

```

**Ejercicio 2: Insertar los cuatro clientes restantes**

```javascript
db.clientes.insertMany([
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
])

```

**Ejercicio 3: Agregar un nuevo cliente**

```javascript
db.clientes.insertOne({
    "nombre": "Carlos",
    "apellido": "Ruiz",
    "edad": 40,
    "email": "carlos@gmail.com",
    "ciudad": "Salta",
    "activo": true
})

```

**Ejercicio 4: Agregar un cliente con un nuevo atributo (telefono)**

```javascript
db.clientes.insertOne({
    "nombre": "Ana",
    "apellido": "Suarez",
    "edad": 28,
    "email": "ana@gmail.com",
    "ciudad": "Neuquén",
    "activo": true,
    "telefono": "2991112233"
})

```

---

## Parte 4: Consultas (Read)

**Ejercicio 1: Mostrar todos los documentos**

```javascript
db.clientes.find({})

```

**Ejercicio 2: Buscar solamente los clientes activos**

```javascript
db.clientes.find({ "activo": true })

```

**Ejercicio 3: Buscar únicamente los clientes inactivos**

```javascript
db.clientes.find({ "activo": false })

```

**Ejercicio 4: Buscar los clientes mayores de 25 años**

```javascript
db.clientes.find({ "edad": { $gt: 25 } })

```

**Ejercicio 5: Buscar clientes cuya edad esté entre 20 y 30 años**

```javascript
db.clientes.find({ "edad": { $gte: 20, $lte: 30 } })

```

**Ejercicio 6: Buscar únicamente los clientes de Rosario**

```javascript
db.clientes.find({ "ciudad": "Rosario" })

```

**Ejercicio 7: Buscar los clientes de Rosario que además estén activos**

```javascript
db.clientes.find({ "ciudad": "Rosario", "activo": true })

```

**Ejercicio 8: Mostrar solamente los campos nombre y email**

```javascript
db.clientes.find({}, { "nombre": 1, "email": 1, "_id": 0 })

```

**Ejercicio 9: Ordenar los clientes por edad, del mayor al menor**

```javascript
db.clientes.find({}).sort({ "edad": -1 })

```

**Ejercicio 10: Mostrar únicamente los tres clientes más jóvenes**

```javascript
db.clientes.find({}).sort({ "edad": 1 }).limit(3)

```

**Ejercicio 11: Mostrar el segundo cliente más joven**

```javascript
db.clientes.find({}).sort({ "edad": 1 }).skip(1).limit(1)

```

---

## Parte 5: Actualización (Update)

**Ejercicio 1: Cambiar la ciudad de Juan**

```javascript
db.clientes.updateOne(
    { "nombre": "Juan" },
    { $set: { "ciudad": "Mar del Plata" } }
)

```

**Ejercicio 2: Actualizar el email de Lucía**

```javascript
db.clientes.updateOne(
    { "nombre": "Lucía" },
    { $set: { "email": "nuevo.email@gmail.com" } }
)

```

**Ejercicio 3: Incrementar en 1 la edad de Pedro**

```javascript
db.clientes.updateOne(
    { "nombre": "Pedro" },
    { $inc: { "edad": 1 } }
)

```

**Ejercicio 4: Agregar el atributo premium a María**

```javascript
db.clientes.updateOne(
    { "nombre": "María" },
    { $set: { "premium": true } }
)

```

**Ejercicio 5: Eliminar el atributo telefono del cliente Ana**

```javascript
db.clientes.updateOne(
    { "nombre": "Ana" },
    { $unset: { "telefono": "" } }
)

```

**Ejercicio 6: Renombrar el atributo ciudad por localidad**

```javascript
db.clientes.updateMany(
    {},
    { $rename: { "ciudad": "localidad" } }
)

```

**Ejercicio 7: Actualizar clientes activos agregando descuento**

```javascript
db.clientes.updateMany(
    { "activo": true },
    { $set: { "descuento": true } }
)

```

**Ejercicio 8: Activar a todos los clientes menores de 21 años**

```javascript
db.clientes.updateMany(
    { "edad": { $lt: 21 } },
    { $set: { "activo": true } }
)

```

---

## Parte 6: Eliminación (Delete)

**Ejercicio 1: Eliminar el cliente llamado Carlos**

```javascript
db.clientes.deleteOne({ "nombre": "Carlos" })

```

**Ejercicio 2: Eliminar todos los clientes inactivos**

```javascript
db.clientes.deleteMany({ "activo": false })

```

**Ejercicio 3: Eliminar todos los clientes menores de 20 años**

```javascript
db.clientes.deleteMany({ "edad": { $lt: 20 } })

```

**Ejercicio 4: Eliminar clientes con dominio hotmail.com**

```javascript
db.clientes.deleteMany({ "email": { $regex: "@hotmail\\.com$" } })

```

---

## Parte 7: Desafíos Integradores

**Desafío 1: Agregar cinco clientes nuevos**

```javascript
db.clientes.insertMany([
    { "nombre": "Marta", "edad": 45, "activo": true, "localidad": "Tucumán" },
    { "nombre": "Diego", "edad": 22, "activo": true, "localidad": "Mendoza" },
    { "nombre": "Laura", "edad": 31, "activo": false, "localidad": "CABA" },
    { "nombre": "Tomas", "edad": 27, "activo": true, "localidad": "Rosario" },
    { "nombre": "Julia", "edad": 50, "activo": true, "localidad": "Córdoba" }
])

```

**Desafío 2: Búsqueda compleja con proyección y ordenamiento**

```javascript
db.clientes.find(
    { "activo": true, "edad": { $gt: 25 } }, 
    { "nombre": 1, "localidad": 1, "_id": 0 }
).sort({ "edad": -1 })

```

*Nota: Se utiliza "localidad" en lugar de "ciudad" porque el campo fue renombrado en el Ejercicio 6 de la Parte 5.*

**Desafío 3: Actualizar e incrementar edad**

```javascript
db.clientes.updateMany(
    { "localidad": "Córdoba" },
    { $inc: { "edad": 2 } }
)

```

**Desafío 4: Eliminar por atributo premium en false**

```javascript
db.clientes.deleteMany({ "premium": false })

```

---

## Parte 8: Comprendiendo el Modelo Flexible

**Inserción del documento con estructura distinta**

```javascript
db.clientes.insertOne({
    "nombre": "Administrador",
    "permisos": [
        "crear",
        "editar",
        "eliminar"
    ]
})

```
| Pregunta para debatir | Respuesta esperada |
| --- | --- |
| **¿Por qué MongoDB acepta este documento si su estructura es radicalmente diferente a la de un "Cliente"?** | Porque utiliza un formato basado en documentos (BSON). No requiere definir tablas, columnas ni tipos de datos por adelantado. La base de datos asume que la lógica de la aplicación se encargará de gestionar las diferentes estructuras. |
| **¿Qué ventajas ofrece esta flexibilidad frente a una base de datos SQL (relacional) tradicional?** | Permite un desarrollo más ágil y rápido (ideal para metodologías iterativas). Facilita el almacenamiento de datos heterogéneos, listas (como el array de permisos) o documentos anidados sin necesidad de crear tablas intermedias o hacer operaciones JOIN complejas. |
| **¿En qué situaciones esta flexibilidad podría convertirse en una desventaja o generar un problema en el Backend?** | Cuando se requiere integridad de datos estricta. Si el backend no valida correctamente los datos antes de insertarlos, la colección puede llenarse de documentos inconsistentes (ej. edades en formato String, faltantes de campos obligatorios), lo que provoca errores en tiempo de ejecución al momento de consultar la información. |