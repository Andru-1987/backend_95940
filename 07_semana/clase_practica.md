## Clase de Backend: Gestión de MongoDB mediante Interfaz Gráfica (MongoDB Compass)

La interacción con el motor de bases de datos MongoDB puede realizarse prescindiendo de la interfaz de línea de comandos (CLI) mediante el uso de **MongoDB Compass**, la herramienta gráfica oficial (GUI) diseñada para la administración, visualización y manipulación de datos.

A continuación, se presenta la adaptación académica y formal de las operaciones de persistencia implementadas exclusivamente desde este entorno gráfico.

---

## 1. Configuración Inicial y Establecimiento de Conexión

* **Ejecución del Entorno:** Iniciar la aplicación MongoDB Compass desde el panel de aplicaciones del sistema operativo.
* **Parámetros de Red:** En la interfaz de inicio, verificar que la URI de conexión apunte al servicio local mediante la dirección `mongodb://localhost:27017` (puerto por defecto de MongoDB). Posteriormente, accionar el botón **"Connect"**.
* **Inspección del Servidor:** El panel lateral izquierdo (sección "Databases") provee una vista jerárquica de las bases de datos activas en la instancia del servidor, actuando como el equivalente visual del comando analítico `show dbs`.

---

## 2. Operaciones Administrativas en la Interfaz Gráfica

* **Instanciación de una Base de Datos:** Para inicializar una base de datos y su primera estructura, se debe seleccionar el botón **"Create Database"**. En el cuadro de diálogo emergente, especificar el nombre de la base de datos (ej. `miPrimeraBase`) y el nombre de la colección inicial (ej. `usuarios`). Esta acción unifica la lógica de los comandos `use <database>` y `db.createCollection(<collection>)`.
* **Adición de Colecciones:** Una vez posicionado dentro del contexto de una base de datos activa, la incorporación de nuevas estructuras se realiza mediante el botón **"Create Collection"**, situado en el margen superior derecho del panel central.

---

## 3. Operaciones CRUD: Inserción y Lectura de Datos

### 3.1. Inserción Unitaria (Equivalente a `insertOne`)

1. Seleccionar la base de datos y la colección correspondiente en el panel de navegación izquierdo.
2. Hacer clic en el botón **"Add Data"** y seleccionar la opción **"Insert Document"**.
3. En la ventana modal, configurar la vista en modo JSON e ingresar el documento estructurado:

```json
{
  "name": "Miguel",
  "last_name": "Espinosa",
  "age": 30,
  "email": "correoMiguel@hotmail.com"
}

```

4. Ejecutar la acción mediante el botón **"Insert"**. El motor generará de forma automática el identificador único e inmutable `_id`.

### 3.2. Lectura Global (Equivalente a `find()`)

Al seleccionar una colección, MongoDB Compass ejecuta una consulta implícita sin restricciones, desplegando los primeros 20 documentos en la pestaña **"Documents"** sin requerir intervención de comandos manuales.

### 3.3. Inserción Múltiple (Equivalente a `insertMany`)

1. Acceder a **"Add Data"** -> **"Insert Document"**.
2. En el editor JSON, definir un arreglo que contenga múltiples objetos independientes:

```json
[
  { "name": "Mauricio", "age": 25, "gender": "M" },
  { "name": "Marisol", "age": 23, "gender": "F" }
]

```

3. Confirmar la operación para persistir el conjunto de datos de manera atómica.

### 3.4. Filtrado Básico de Lectura

1. Localizar la barra de herramientas superior denominada **"Filter"**.
2. Introducir el criterio de búsqueda bajo la sintaxis estricta de un objeto JSON:

```json
{ "gender": "M" }

```

3. Presionar el botón **"Find"** para actualizar la vista con los documentos que satisfacen la condición especificada.

---

## 4. Configuración Avanzada de Consultas: Filtros y Control de Flujo

La barra de opciones avanzadas de MongoDB Compass segmenta las cláusulas de consulta en campos de texto específicos, optimizando el rendimiento de la transmisión de datos:

* **Filter (Criterio de Selección):** Permite la evaluación de operadores lógicos y relacionales complejos.
* *Ejemplo de evaluación lógica:* `{ $or: [ {"year": 1958}, {"year": 1959} ] }`
* *Ejemplo de existencia de atributos:* `{ name: { $exists: true } }`
* *Ejemplo de validación de tipos:* `{ "zipCode": { $type: "string" } }`


* **Project (Proyección de Campos):** Restringe los atributos devueltos para minimizar la carga útil del canal de red. La sintaxis `{ "name": 1 }` suprime todos los campos excepto el campo explícito y el identificador `_id`.
* **Sort (Ordenamiento):** Define la secuencia de los resultados. Utiliza el valor `1` para ordenamiento ascendente y `-1` para ordenamiento descendente (ej. `{ "age": -1 }`).
* **Skip (Omisión):** Indica la cantidad de documentos que se deben omitir desde el inicio del conjunto de resultados (esencial para arquitecturas de paginación).
* **Limit (Restricción):** Determina el techo máximo de documentos a transferir en la consulta.

---

## 5. Operaciones de Actualización (Update) mediante GUI

### 5.1. Modificación Unitaria Manual

1. Aplicar un filtro restrictivo en la barra **"Filter"** para aislar el documento objetivo (ej. `{ "_id": 1 }`).
2. Desplazar el cursor sobre el registro y accionar el ícono de edición (**Edit / Lápiz**).
3. Modificar los valores directamente en la interfaz o emplear operadores atómicos de modificación en el modo JSON:

```json
{ "$inc": { "year": 5 } }

```

4. Confirmar los cambios mediante el botón **"Update"**.

### 5.2. Modificación Masiva

1. Accionar el botón **"Update"** disponible en la barra de herramientas avanzada.
2. Configurar los dos campos requeridos:
* **Filter:** Criterio de segmentación (ej. `{ "edad": 25 }`).
* **Update:** Operador de modificación (ej. `{ $set: { "edad": 26 } }`).


3. Habilitar explícitamente la casilla **"Update many documents"** para autorizar el impacto multidocumento.

> ### Referencia Sintáctica de Operadores de Modificación en Compass
> 
> 
> * `{ $set: { "year": 2016 } }` — Asignación o creación de atributo.
> * `{ $unset: { "year": "" } }` — Remoción del atributo del documento.
> * `{ $rename: { "year": "date" } }` — Modificación de la clave del atributo.
> * `{ $inc: { "year": 5 } }` — Incremento numérico atómico.
> * `{ $mul: { "price": 1.25 } }` — Multiplicación del valor numérico.
> * `{ $min: { "imdb": 5 } }` / `{ $max: { "imdb": 8 } }` — Actualización condicionada por límites.
> * `{ $currentDate: { "lastModified": true } }` — Estampado de la fecha del sistema.
> 
> 

---

## 6. Operaciones de Eliminación (Delete) mediante GUI

* **Remoción Unitaria:** Tras aislar el documento mediante un filtro específico, seleccionar el ícono de eliminación (**Delete / Basura**) ubicado en el extremo derecho del registro y confirmar la transacción en el cuadro de diálogo.
* **Remoción Masiva:** Seleccionar el botón **"Delete"** en la barra superior de herramientas, ingresar la condición de filtrado (ej. `{ "nombre": "Juan" }`), validar la opción para afectar múltiples registros y confirmar la purga de datos.

---

## 7. Guía de Ejercicios Prácticos y Resolución de Errores

### Caso A: Inicialización y Persistencia de Entidades Académicas

1. Estructurar la base de datos `estudiantes` junto con su colección homónima.
2. Insertar un bloque de 5 documentos mediante un arreglo JSON en el submódulo **"Insert Document"**.
3. Validar la persistencia mediante la actualización automática de la cuadrícula de datos.

### Caso B: Evaluación de Criterios Específicos

1. Crear el espacio de nombres `baseCRUD.mascotas`.
2. Registrar un conjunto inicial de entidades con los atributos `nombre`, `especie` y `edad`.
3. Restringir la vista aplicando en el campo **"Filter"** el objeto `{ "especie": "perro" }`. El indicador de volumen (ej. "Showing 1 of 3") reflejará el impacto del filtro en tiempo real.

### Caso C: Demostración de Flexibilidad de Esquema (Polimorfismo)

1. En la colección `estudiantes`, realizar la inserción de 5 registros con estructura completa (`nombre`, `apellido`, `curso`, `edad`, `sexo`).
2. Insertar un sexto documento omitiendo los atributos `edad` y `sexo`. La GUI procesará el documento exitosamente, demostrando la naturaleza no relacional y la ausencia de restricciones de esquema rígidas.

### Caso D: Secuenciación y Modificación Masiva

Para un conjunto de datos indexado de clientes (`Pablo:25`, `Juan:22`, `Lucía:25`, `Juan:29`, `Fede:35`), el comportamiento en Compass se configura del siguiente modo:

* **Ordenamiento Descendente:** Configurar **"Sort"** con `{ "edad": -1 }`.
* **Aislamiento de Extremos (Mínimo):** Configurar **"Sort"** con `{ "edad": 1 }` y **"Limit"** con `1`.
* **Paginación Relativa:** Configurar **"Sort"** con `{ "edad": 1 }`, **"Skip"** con `1`, y **"Limit"** con `1`.
* **Evaluación de Rangos Numéricos:** Insertar en **"Filter"** el objeto `{ "edad": { $gte: 26, $lte: 35 } }`.
* **Actualización Masiva:** Emplear el panel **"Update"** con el filtro `{ "edad": 25 }` y la instrucción `{ $set: { "edad": 26 } }`, asegurando la activación del procesamiento masivo.

### Caso E: Depuración de Sintaxis en Entornos Gráficos (#FindTheBug)

1. **Error en Inserción Múltiple:** * *Corrección:* Compass no procesa llamadas de métodos CLI dentro del modal de inserción. Debe removerse la instrucción `insertMany()` y proveer únicamente el arreglo puro en el editor de texto:
```json
[
  { "name": "aletas", "specie": "fish" },
  { "name": "Doby", "specie": "dog" }
]

```


2. **Fallo de Entrecomillado en Filtros:**
* *Corrección:* La anomalía original residía en la omisión de comillas en el valor del atributo. En la barra **"Filter"** se debe ingresar `{ "specie": "fish" }` y definir el valor `5` en el campo **"Limit"**.


3. **Malformación de Estructura de Operadores:**
* *Corrección:* Para proyectar atributos condicionados, se debe segmentar la instrucción. En la barra **"Filter"** se define el rango `{ "age": { $lt: 10 } }`, mientras que en la barra **"Project"** se delimita la exclusión mediante `{ "name": 1 }`. El control de volumen se delega al campo **"Limit"** con el valor `5`.