# MongoDB Cheat Sheet - Comandos Básicos

## Gestión de Bases de Datos

| Acción                                | Comando             |
| ------------------------------------- | ------------------- |
| Mostrar todas las bases de datos      | `show dbs`          |
| Seleccionar o crear una base de datos | `use nombreBD`      |
| Mostrar la base de datos actual       | `db`                |
| Eliminar la base de datos actual      | `db.dropDatabase()` |

---

## Gestión de Colecciones

| Acción              | Comando                           |
| ------------------- | --------------------------------- |
| Mostrar colecciones | `show collections`                |
| Crear colección     | `db.createCollection("usuarios")` |
| Eliminar colección  | `db.usuarios.drop()`              |

---

## Create (Insertar)

| Acción                     | Comando                                  |
| -------------------------- | ---------------------------------------- |
| Insertar un documento      | `db.usuarios.insertOne({...})`           |
| Insertar varios documentos | `db.usuarios.insertMany([{...}, {...}])` |

---

## Read (Consultar)

| Acción                       | Comando                                     |
| ---------------------------- | ------------------------------------------- |
| Obtener todos los documentos | `db.usuarios.find()`                        |
| Obtener un documento         | `db.usuarios.findOne()`                     |
| Buscar por campo             | `db.usuarios.find({nombre:"Carlos"})`       |
| Contar documentos            | `db.usuarios.countDocuments()`              |
| Contar con filtro            | `db.usuarios.countDocuments({activo:true})` |

---

## Operadores de Comparación

| Operador | Descripción          | Ejemplo                           |
| -------- | -------------------- | --------------------------------- |
| `$eq`    | Igual a              | `{edad: {$eq: 18}}`               |
| `$ne`    | Distinto de          | `{edad: {$ne: 18}}`               |
| `$gt`    | Mayor que            | `{edad: {$gt: 18}}`               |
| `$gte`   | Mayor o igual que    | `{edad: {$gte: 18}}`              |
| `$lt`    | Menor que            | `{edad: {$lt: 18}}`               |
| `$lte`   | Menor o igual que    | `{edad: {$lte: 18}}`              |
| `$in`    | Dentro de una lista  | `{nombre: {$in:["Ana","Juan"]}}`  |
| `$nin`   | No está en una lista | `{nombre: {$nin:["Ana","Juan"]}}` |

---

## Operadores Lógicos

| Operador | Descripción                           | Ejemplo                                   |
| -------- | ------------------------------------- | ----------------------------------------- |
| `$and`   | Todas las condiciones deben cumplirse | `{$and:[{activo:true},{edad:{$gte:18}}]}` |
| `$or`    | Al menos una condición debe cumplirse | `{$or:[{nombre:"Ana"},{edad:{$lt:18}}]}`  |
| `$not`   | Niega una condición                   | `{edad:{$not:{$gt:30}}}`                  |

---

## Proyecciones

| Acción                      | Comando                                    |
| --------------------------- | ------------------------------------------ |
| Mostrar solo ciertos campos | `db.usuarios.find({}, {nombre:1, edad:1})` |
| Ocultar un campo            | `db.usuarios.find({}, {email:0})`          |
| Ocultar `_id`               | `db.usuarios.find({}, {_id:0})`            |

---

## Ordenamiento y Paginación

| Acción              | Comando                              |
| ------------------- | ------------------------------------ |
| Orden ascendente    | `.sort({edad:1})`                    |
| Orden descendente   | `.sort({edad:-1})`                   |
| Limitar resultados  | `.limit(5)`                          |
| Saltar resultados   | `.skip(10)`                          |
| Paginación completa | `.sort({edad:-1}).skip(10).limit(5)` |

---

## Update (Actualizar)

| Acción                        | Comando                                     |
| ----------------------------- | ------------------------------------------- |
| Actualizar un documento       | `db.usuarios.updateOne(filtro, cambios)`    |
| Actualizar varios documentos  | `db.usuarios.updateMany(filtro, cambios)`   |
| Reemplazar documento completo | `db.usuarios.replaceOne(filtro, documento)` |

### Operadores de Actualización

| Operador | Descripción                  | Ejemplo                       |
| -------- | ---------------------------- | ----------------------------- |
| `$set`   | Asigna o modifica un valor   | `{$set:{activo:true}}`        |
| `$inc`   | Incrementa un número         | `{$inc:{edad:1}}`             |
| `$unset` | Elimina un campo             | `{$unset:{telefono:""}}`      |
| `$push`  | Agrega elemento a un array   | `{$push:{hobbies:"MongoDB"}}` |
| `$pull`  | Elimina elemento de un array | `{$pull:{hobbies:"Lectura"}}` |

---

## Delete (Eliminar)

| Acción                        | Comando                          |
| ----------------------------- | -------------------------------- |
| Eliminar un documento         | `db.usuarios.deleteOne(filtro)`  |
| Eliminar varios documentos    | `db.usuarios.deleteMany(filtro)` |
| Eliminar todos los documentos | `db.usuarios.deleteMany({})`     |

---

## Índices

| Acción                   | Comando                              |
| ------------------------ | ------------------------------------ |
| Crear índice ascendente  | `db.usuarios.createIndex({email:1})` |
| Crear índice descendente | `db.usuarios.createIndex({edad:-1})` |
| Ver índices              | `db.usuarios.getIndexes()`           |
| Eliminar índice          | `db.usuarios.dropIndex("email_1")`   |

---

## Comandos de Ayuda

| Acción                  | Comando                     |
| ----------------------- | --------------------------- |
| Ayuda general           | `help`                      |
| Ayuda de la base actual | `db.help()`                 |
| Ayuda de una colección  | `db.usuarios.help()`        |
| Ver métodos disponibles | `db.usuarios.find().help()` |

---

## Flujo CRUD Típico

```javascript
// CREATE
db.usuarios.insertOne({nombre:"Ana", edad:20})

// READ
db.usuarios.find({edad:{$gte:18}})

// UPDATE
db.usuarios.updateOne(
  {nombre:"Ana"},
  {$set:{edad:21}}
)

// DELETE
db.usuarios.deleteOne({nombre:"Ana"})
```
