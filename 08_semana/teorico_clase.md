#Persistencia en NoSQL con MongoDB, Atlas y Node.js

A diferencia de las bases de datos relacionales (SQL) que utilizan tablas, filas y columnas fijas, MongoDB almacena la información en documentos JSON (técnicamente BSON). Esto otorga una flexibilidad enorme, pero requiere comprender a fondo cómo establecer conexiones, gestionar el alojamiento y mantener la integridad estructural en una aplicación backend.

---

## 1. El Ecosistema de Conexión y Almacenamiento

### 1.1. Clientes de Base de Datos

Un cliente de base de datos es cualquier interfaz o programa que se conecta a un sistema de gestión de bases de datos para ejecutar operaciones CRUD. En el ecosistema MongoDB, se distinguen cuatro tipos:

* **Cliente CLI**: Interfaz de línea de comandos (mongo shell) para ejecutar consultas directas. Es útil para depuración y scripts administrativos.
* **Cliente GUI**: Aplicaciones con interfaz gráfica como MongoDB Compass, que permiten explorar visualmente documentos, índices y estadísticas del servidor. Ideal para el desarrollo local.
* **Cliente Web**: Plataformas basadas en navegador, como MongoDB Atlas, que ofrecen acceso a la base de datos desde cualquier ubicación sin depender de una máquina local.
* **Cliente App**: La aplicación backend propia (Node.js) que se conecta programáticamente mediante un driver u ODM. Este es el modelo principal en desarrollo de APIs, ya que automatiza las operaciones CRUD dentro de la lógica de negocio.

**Analogía didáctica:** Un cliente de base de datos es como un "tipo de acceso" a un almacén. El CLI es la puerta trasera con llave maestra, el GUI es el almacén con pasillos y estantes etiquetados, el Web es la tienda en línea accesible desde cualquier navegador, y la App es un sistema automatizado que recoge y coloca mercancía según reglas predefinidas.

### 1.2. DBaaS (Database as a Service)

DBaaS es un modelo de computación en la nube donde el proveedor gestiona toda la infraestructura física, mantenimiento, parches de seguridad, replicación y alta disponibilidad de la base de datos. El usuario solo administra sus propios datos, esquemas e índices.

* **Problema que resuelve**: La escalabilidad horizontal y vertical de bases de datos tradicionales requiere inversión en hardware, personal especializado, espacio físico y energía. DBaaS externaliza estos costos a un modelo de suscripción.
* **Ventajas documentadas**:
    * Eliminación de infraestructura física y reducción de costos operativos.
    * Escalabilidad elástica sin interrupción del servicio.
    * Acceso a personal cualificado del proveedor.
    * Modelo de pago por uso.
* **Proveedores del mercado**: Amazon (RDS para MongoDB), Google (Cloud Firestore), Microsoft (Azure Cosmos DB) y MongoDB Atlas.

**Analogía didáctica:** DBaaS es como alquilar un almacén climatizado con vigilancia y mantenimiento incluido, en lugar de comprar el terreno, construir el edificio, contratar seguridad y pagar la electricidad. Usted solo decide qué productos guardar.

### 1.3. MongoDB Atlas

MongoDB Atlas es la solución DBaaS oficial de MongoDB. Tradicionalmente, un desarrollador debía instalar MongoDB en su propia máquina o servidor Linux; con Atlas, se despliega una base de datos segura y escalable en la nube con unos pocos clics.

**Características y ventajas destacadas:**
* **Automatización y Rapidez**: Puesta en marcha de un clúster en segundos.
* **Escalabilidad y Disponibilidad**: Escalado horizontal (sharding) y vertical sin tiempo de inactividad. Clústeres replicados con tolerancia a fallos.
* **Seguridad Integral**: Autenticación, cifrado en tránsito y en reposo, y listas de control de acceso por IP.
* **Respaldo**: Copias de seguridad continuas con recuperación punto en el tiempo (point-in-time recovery).

---

## 2. El Corazón del Backend: Mongoose como ODM

MongoDB es una base de datos *schemaless* (sin esquema estricto). Esto significa que en una misma colección podrías guardar un usuario con edad numérica y otro con edad en texto. En producción, esta anarquía puede romper las aplicaciones backend.

Para solucionar esto se utiliza **Mongoose**, un **Object Document Mapper (ODM)** para Node.js y MongoDB. Su función es proporcionar una capa de abstracción que actúa como traductor inteligente entre los objetos del código JavaScript y los documentos de MongoDB, imponiendo orden, validación y estructura.

### 2.1. Diferencias clave con el driver nativo

* El driver nativo de MongoDB trabaja con objetos JSON planos y promesas sin estructura fija.
* Mongoose impone un esquema (opcional pero recomendado) que da consistencia estructural a las colecciones.
* Mongoose ofrece funcionalidades avanzadas: validación integrada, casting de tipos, población de referencias (populate) y middleware pre/post save.

### 2.2. Estructura Fundamental: Schemas vs. Models

Para usar Mongoose de forma correcta en el flujo de trabajo, se deben diferenciar dos conceptos:

1.  **El Schema (Esquema):** Es el plano arquitectónico o "molde". Aquí se definen los campos del documento, sus tipos de datos (String, Number, Date, Boolean), validaciones y reglas. El esquema no interactúa con la base de datos directamente.
2.  **El Model (Modelo):** Es el ejecutor o clase constructora creada a partir del Schema. El modelo se comunica directamente con la base de datos para ejecutar operaciones (`find()`, `create()`, `deleteOne()`).

**Analogía didáctica:** Mongoose es como un "molde para galletas" que garantiza que cada documento insertado tenga la misma forma, mientras que el driver nativo sería como amasar libremente, lo que da flexibilidad pero genera inconsistencias.

### 2.3. Ejemplo Práctico de Implementación (ES6 Modules)

**Definición del Modelo (`src/models/estudiante.model.js`)**

```javascript
import mongoose from 'mongoose';

// 1. Definimos el Molde (Schema)
const estudianteSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true,
        lowercase: true
    },
    edad: {
        type: Number,
        min: [16, 'La edad mínima para inscribirse es 16 años'],
        max: 99
    },
    activo: {
        type: Boolean,
        default: true
    }
}, { versionKey: false, timestamps: true });

// 2. Compilamos el Modelo
const Estudiante = mongoose.model('Estudiante', estudianteSchema);

export default Estudiante;

```

**Uso en un Enrutador (`src/routes/estudiantes.router.js`)**

```javascript
import { Router } from 'express';
import Estudiante from '../models/estudiante.model.js'; // Importante incluir la extensión .js en módulos nativos de Node

const router = Router();

// Endpoint para registrar un estudiante (Create)
router.post('/', async (req, res) => {
    try {
        // Mongoose valida req.body contra el esquema automáticamente
        const nuevoEstudiante = await Estudiante.create(req.body);
        res.status(201).json({ status: 'success', data: nuevoEstudiante });
    } catch (error) {
        // Captura de errores de validación (ej. edad menor a 16)
        res.status(400).json({ status: 'error', message: error.message });
    }
});

export default router;

```

---

## 3. Glosario y Dominio de Consultas de Datos

Cuando se extrae información, es fundamental optimizar el tráfico de red y la memoria del servidor Node.js utilizando modificadores de consulta sobre las operaciones CRUD básicas (Create, Read, Update, Delete).

* **Proyección**: Permite especificar qué campos del documento deben ser devueltos. Útil para omitir datos sensibles (como contraseñas) y reducir el tamaño de la respuesta.
* *Sintaxis:* `find({}, { nombre: 1, email: 1 })` incluye esos campos; `{ password: 0 }` lo excluye.


* **Sort (Ordenamiento)**: Organiza los resultados bajo un criterio específico.
* *Sintaxis:* `sort({ campoA: 1, campoB: -1 })`. El `1` es ascendente y el `-1` es descendente.


* **Limit**: Restringe la cantidad máxima de documentos devueltos por la base de datos.
* *Sintaxis:* `.limit(10)`.


* **Skip**: Omite un número específico de documentos desde el inicio del conjunto de resultados.
* *Sintaxis:* `.skip(offset)`.



**La Fórmula de la Paginación:**
Al combinar `limit` y `skip`, se implementa la paginación de resultados. Si un cliente solicita la página 3 mostrando 10 elementos por página, la lógica de backend sería:
`skip = (pagina - 1) * limite` -> `skip = (3 - 1) * 10 = 20`. El motor salta los primeros 20 documentos y devuelve los siguientes 10.

---

## 4. Arquitectura de Proyecto y Conclusión

Para mantener un proyecto escalable en Node.js con Mongoose, la convención estándar propone la siguiente separación de responsabilidades:

* `src/models/`: Contiene las definiciones de esquemas y modelos (ej. `estudiante.model.js`).
* `src/routes/`: Contiene los enrutadores de la API (ej. `estudiantes.router.js`).
* `src/app.js` (o `server.js`): Punto de entrada donde se configura Express, se parsea el JSON (`express.json()`), se establece la conexión con `mongoose.connect()` y se montan las rutas utilizando `app.use()`.

**¿Por qué es crucial usar esta estructura junto a Mongoose?**
El uso de Mongoose centraliza toda la lógica de negocio, seguridad y sanidad de datos directamente en la capa de persistencia. Esto garantiza una base de datos predecible, acelera el desarrollo con métodos preconstruidos y logra un código mantenible al desacoplar las validaciones de las rutas del servidor.
