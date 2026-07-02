# Desarrollo paso a paso de un CRUD de Productos con Mongoose

En esta sesión práctica, vamos a consolidar los conceptos teóricos construyendo una API REST funcional. Aplicaremos una arquitectura modular para desacoplar responsabilidades, utilizando ES6 Modules y conectándonos a MongoDB Atlas mediante Mongoose.

El objetivo final es tener un servidor Node.js capaz de gestionar un catálogo de productos a través de operaciones de Creación, Lectura, Actualización y Eliminación (CRUD).

---

## Paso 1: Configuración Inicial del Entorno

Antes de escribir código, necesitamos preparar el terreno y asegurar que nuestro proyecto soporte la sintaxis moderna de JavaScript (ES6).

1. Inicializa el proyecto y crea el `package.json`:
```bash
npm init -y

```


2. Instala las dependencias necesarias:
```bash
npm install express mongoose

```


3. **Paso crítico para ES6**: Abre tu archivo `package.json` y añade la propiedad `"type": "module"`. Esto le indica a Node.js que utilice `import/export` en lugar de `require()`.
```json
{
  "name": "practica-crud-productos",
  "version": "1.0.0",
  "type": "module",
  "main": "src/app.js",
  "dependencies": {
    "express": "^4.x.x",
    "mongoose": "^8.x.x"
  }
}

```



Crea la siguiente estructura de carpetas para mantener el código ordenado:

```text
/src
  /models
    product.model.js
  /routes
    products.router.js
  app.js

```

---

## Paso 2: Definición del Esquema y Modelo

Vamos a traducir la estructura JSON del producto a un esquema estricto de Mongoose. Esto garantizará que no ingresen datos corruptos a nuestra base de datos.

**Archivo: `src/models/product.model.js**`

```javascript
import mongoose from 'mongoose';

// 1. Definimos las reglas y tipos de datos de nuestro documento
const productSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: [true, 'El título es obligatorio'] 
    },
    description: { 
        type: String, 
        required: [true, 'La descripción es obligatoria'] 
    },
    code: { 
        type: String, 
        required: [true, 'El código de producto es obligatorio'], 
        unique: true // Evita productos con códigos duplicados
    },
    price: { 
        type: Number, 
        required: true,
        min: [0, 'El precio no puede ser negativo']
    },
    status: { 
        type: Boolean, 
        default: true 
    },
    stock: { 
        type: Number, 
        required: true,
        min: 0
    },
    category: { 
        type: String, 
        required: true 
    },
    thumbnails: { 
        type: [String], // Array de strings
        default: [] 
    },
    id: { 
        type: String, 
        required: true, 
        unique: true 
    }
}, { 
    versionKey: false, 
    timestamps: true // Añade automáticamente createdAt y updatedAt
});

// 2. Exportamos el modelo compilado
export default mongoose.model('Product', productSchema);

```

---

## Paso 3: Desarrollo del Enrutador (Operaciones CRUD)

Aquí crearemos los endpoints que recibirán las peticiones del cliente (Postman o el Frontend) y utilizarán nuestro modelo para interactuar con MongoDB.

**Archivo: `src/routes/products.router.js**`

```javascript
import { Router } from 'express';
import Product from '../models/product.model.js'; // Recuerda usar la extensión .js

const router = Router();

// CREATE: Agregar un nuevo producto (POST)
router.post('/', async (req, res) => {
    try {
        const productData = req.body;
        const newProduct = await Product.create(productData);
        res.status(201).json({ status: 'success', payload: newProduct });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
});

// READ: Obtener todos los productos (GET)
router.get('/', async (req, res) => {
    try {
        // Usamos find() sin filtros para traer toda la colección
        const products = await Product.find();
        res.status(200).json({ status: 'success', payload: products });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

// READ: Obtener un producto específico por su 'id' personalizado (GET)
router.get('/:pid', async (req, res) => {
    try {
        const product = await Product.findOne({ id: req.params.pid });
        if (!product) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        }
        res.status(200).json({ status: 'success', payload: product });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// UPDATE: Actualizar un producto existente (PUT)
router.put('/:pid', async (req, res) => {
    try {
        const updateData = req.body;
        // findOneAndUpdate busca por la condición y aplica los cambios. 
        // new: true devuelve el documento modificado en lugar del original.
        const updatedProduct = await Product.findOneAndUpdate(
            { id: req.params.pid }, 
            updateData, 
            { new: true, runValidators: true } // runValidators asegura que se respeten las reglas del Schema
        );

        if (!updatedProduct) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado para actualizar' });
        }
        res.status(200).json({ status: 'success', payload: updatedProduct });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
});

// DELETE: Eliminar un producto (DELETE)
router.delete('/:pid', async (req, res) => {
    try {
        const deletedProduct = await Product.findOneAndDelete({ id: req.params.pid });
        if (!deletedProduct) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado para eliminar' });
        }
        res.status(200).json({ status: 'success', message: `Producto ${req.params.pid} eliminado correctamente` });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

export default router;

```

---

## Paso 4: Integración y Conexión a MongoDB Atlas

El último paso es unir todas las piezas: levantar el servidor de Express, habilitar la lectura de JSON y conectarnos a la base de datos de Atlas mediante promesas.

**Archivo: `src/app.js**`

```javascript
import express from 'express';
import mongoose from 'mongoose';
import productsRouter from './routes/products.router.js';

const app = express();
const PORT = 8080;

// Middleware fundamental para poder parsear el body de las peticiones POST/PUT
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexión a MongoDB Atlas usando Promesas nativas
// Reemplaza <usuario> y <password> con tus credenciales reales de Atlas
const MONGO_URI = 'mongodb+srv://<usuario>:<password>@cluster0.mongodb.net/ecommerce?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Conexión a la base de datos establecida con éxito');
        
        // Montamos el router solo si la conexión a la base de datos es exitosa
        app.use('/api/products', productsRouter);

        // Levantamos el servidor
        app.listen(PORT, () => {
            console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error(' Error crítico: No se pudo conectar a la base de datos.', error.message);
        // Cerramos el proceso de Node si la base de datos falla
        process.exit(1);
    });

```

---

## Paso 5: Guía de Pruebas (Postman)

Para verificar que la implementación funciona, utiliza Postman apuntando a `http://localhost:8080/api/products`.

1. **Prueba de Creación (POST):**
* Verbo HTTP: `POST`
* Body -> raw -> JSON
* Carga útil:
```json
{
  "title": "Notebook Lenovo ThinkPad E14",
  "description": "Notebook empresarial con procesador Intel Core i5, 16GB de RAM y SSD de 512GB.",
  "code": "LTP-E14-001",
  "price": 1299.99,
  "status": true,
  "stock": 25,
  "category": "Tecnología",
  "thumbnails": [
    "cat_bg_hd.png"
  ],
  "id": "prod_1781008530402"
}

```




2. **Prueba de Lectura (GET):**
* Realiza un `GET` a la ruta raíz y verifica que devuelve un arreglo conteniendo el producto recién creado.


3. **Prueba de Actualización (PUT):**
* Realiza un `PUT` a `/api/products/prod_1781008530402` enviando en el body JSON un nuevo precio: `{"price": 1150.00}`.


4. **Prueba de Eliminación (DELETE):**
* Realiza un `DELETE` a `/api/products/prod_1781008530402` y luego vuelve a ejecutar el `GET` general para confirmar que el documento fue removido de la colección en Atlas.