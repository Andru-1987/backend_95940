# Clase Práctica: E-commerce API - Usuarios, Productos y Carrito con Mongoose

> Persistencia del Json a DB -> MongoDB

---

## Objetivo de la clase

Construir una API REST de e-commerce con tres entidades relacionadas (Usuarios, Productos y Carritos), usando Mongoose contra MongoDB Atlas, arquitectura modular con ES6 Modules, y relaciones entre documentos mediante `populate`.

Relación final del modelo de datos: **1 Usuario -> N Carritos -> N Productos**.

Al finalizar deberíamos tener:
- Un modelo de Usuarios.
- Un modelo de Productos con validaciones.
- Un modelo de Carritos que referencia a un Usuario y a N Productos.
- Endpoints CRUD completos para las tres entidades (Usuarios de forma acotada, ya que el patrón es el mismo que Productos).
- La lógica de negocio típica de un carrito (agregar, actualizar cantidad, eliminar, vaciar), ahora atada a un usuario dueño del carrito.

---

## Hoja de ruta (timeboxing sugerido)

| Paso | Contenido | Tiempo |
|---|---|---|
| 1 | Configuración inicial del entorno | 10 min |
| 2 | Modelo de Productos | 10 min |
| 3 | Router de Productos (CRUD) | 15 min |
| 4 | Modelo de Usuario y Router básico | 10 min |
| 5 | Modelo de Carrito (relación con Usuario y Productos) | 10 min |
| 6 | Router de Carrito (lógica de negocio) | 25 min |
| 7 | Integración final y conexión a Atlas | 10 min |
| 8 | Pruebas end-to-end con Postman | 10 min |
| 9 | Cierre y desafíos extra | 5 min |


---

## Paso 0: Introducción

Antes de tipear, conversemos en grupo:

- ¿Qué diferencia hay entre un Producto y un Carrito en términos de modelado de datos?
- ¿Por qué un Carrito **no debería** duplicar la información de un Producto, sino referenciarlo?
- Ahora sumamos una tercera entidad: ¿por qué el dueño de un carrito debería ser una referencia a un Usuario y no, por ejemplo, un email suelto como texto plano dentro del carrito?

---

## Paso 1: Configuración inicial del entorno (10 min)

1. Inicializar el proyecto:

```bash
npm init -y
```

2. Instalar dependencias:

```bash
npm install express mongoose
```

3. Habilitar ES6 Modules en `package.json` agregando `"type": "module"`:

```json
{
  "name": "ecommerce-api",
  "version": "1.0.0",
  "type": "module",
  "main": "src/app.js",
  "dependencies": {
    "express": "^4.x.x",
    "mongoose": "^8.x.x"
  }
}
```

4. Crear la estructura de carpetas:

```text
/src
  /models
    user.model.js
    product.model.js
    cart.model.js
  /routes
    users.router.js
    products.router.js
    carts.router.js
  app.js
```

---

## Paso 2: Modelo de Productos (10 min)

Nota de diseño: en vez de mantener un campo `id` manual además del `_id` de Mongo, nos apoyamos directamente en el `_id` nativo de Mongoose. Esto es clave porque, más adelante, el Carrito necesita guardar una **referencia real** (`ObjectId`) a cada Producto.

**Archivo: `src/models/product.model.js`**

```javascript
import mongoose from 'mongoose';

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
        unique: true
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
        type: [String],
        default: []
    }
}, {
    versionKey: false,
    timestamps: true
});

export default mongoose.model('Product', productSchema);
```

**Pregunta para el grupo:** ¿qué pasaría si intentamos guardar un producto con `price: -50`?

---

## Paso 3: Router de Productos (15 min)

**Archivo: `src/routes/products.router.js`**

```javascript
import { Router } from 'express';
import Product from '../models/product.model.js';

const router = Router();

// CREATE
router.post('/', async (req, res) => {
    try {
        const newProduct = await Product.create(req.body);
        res.status(201).json({ status: 'success', payload: newProduct });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
});

// READ ALL
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({ status: 'success', payload: products });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

// READ ONE (por _id de Mongo)
router.get('/:pid', async (req, res) => {
    try {
        const product = await Product.findById(req.params.pid);
        if (!product) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        }
        res.status(200).json({ status: 'success', payload: product });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// UPDATE parcial
router.patch('/:pid', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.pid,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado para actualizar' });
        }
        res.status(200).json({ status: 'success', payload: updatedProduct });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
});

// DELETE
router.delete('/:pid', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.pid);
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

**Nota sobre el verbo HTTP:** este endpoint recibe un body parcial (por ejemplo, solo `{"price": 1150}`) y actualiza únicamente esos campos, sin exigir el documento completo. Esa es la semántica de **PATCH**, no de PUT. PUT implicaría reemplazar el recurso entero, incluyendo los campos que no cambiaron. Por eso el verbo correcto acá es `router.patch(...)`.

---

## Paso 4: Modelo de Usuario y Router básico (10 min)

Antes de armar el Carrito, necesitamos la entidad que lo va a poseer.

**Archivo: `src/models/user.model.js`**

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    lastName: {
        type: String,
        required: [true, 'El apellido es obligatorio']
    },
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        unique: true
    },
    age: {
        type: Number,
        required: true,
        min: [0, 'La edad no puede ser negativa']
    },
    password: {
        type: String,
        required: true,
        select: false // evita que el password vuelva por defecto en los find()
    }
}, {
    versionKey: false,
    timestamps: true
});

export default mongoose.model('User', userSchema);
```

Nota para la clase: guardamos el `password` como texto plano únicamente para no desviarnos del objetivo de esta sesión, que es modelado de relaciones, no autenticación. En una app real, ese campo se hashea con `bcrypt` antes de guardarlo, y `select: false` es justamente una buena práctica para que el hash no viaje en respuestas donde no hace falta.

**Archivo: `src/routes/users.router.js`**

El router de Usuarios sigue exactamente el mismo patrón que ya vimos en Productos, así que lo dejamos acotado a lo mínimo necesario para poder crear usuarios y probar el Carrito. El CRUD completo de Usuarios (update y delete) queda como desafío al final de la clase.

```javascript
import { Router } from 'express';
import User from '../models/user.model.js';

const router = Router();

// CREATE
router.post('/', async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        res.status(201).json({ status: 'success', payload: newUser });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
});

// READ ALL
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ status: 'success', payload: users });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

// READ ONE
router.get('/:uid', async (req, res) => {
    try {
        const user = await User.findById(req.params.uid);
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
        }
        res.status(200).json({ status: 'success', payload: user });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

export default router;
```

---

## Paso 5: Modelo de Carrito y relación con Usuario y Productos

Este es el paso conceptualmente más importante de la clase. El Carrito no almacena copias de productos ni datos sueltos del usuario: guarda referencias (`ObjectId`) a ambos.

**Archivo: `src/models/cart.model.js`**

```javascript
import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true,
                    default: 1,
                    min: [1, 'La cantidad mínima es 1']
                }
            }
        ],
        default: []
    }
}, {
    versionKey: false,
    timestamps: true
});

export default mongoose.model('Cart', cartSchema);
```

**Para discutir en el grupo:** el campo `user` y el campo `products.product` usan el mismo mecanismo (`ref` + `ObjectId`), pero modelan relaciones distintas: `user` es una relación **N a 1** (muchos carritos pueden pertenecer a un mismo usuario, aunque en este diseño lo típico es un carrito activo por usuario), y `products` es una relación **N a N** vía el subdocumento intermedio que además guarda `quantity`.

---

## Paso 6: Router de Carrito - lógica de negocio

**Archivo: `src/routes/carts.router.js`**

```javascript
import { Router } from 'express';
import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';
import User from '../models/user.model.js';

const router = Router();

// CREATE: crear un carrito vacío para un usuario existente
router.post('/', async (req, res) => {
    try {
        const { user } = req.body;

        const existingUser = await User.findById(user);
        if (!existingUser) {
            return res.status(404).json({ status: 'error', message: 'El usuario indicado no existe' });
        }

        const newCart = await Cart.create({ user, products: [] });
        res.status(201).json({ status: 'success', payload: newCart });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
});

// READ: obtener un carrito con los productos completos (populate)
router.get('/:cid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid)
            .populate('products.product')
            .populate('user', 'firstName lastName email'); // traemos solo estos campos del usuario

        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }
        res.status(200).json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// READ: listar todos los carritos de un usuario puntual (1 usuario -> N carritos)
router.get('/user/:uid', async (req, res) => {
    try {
        const carts = await Cart.find({ user: req.params.uid }).populate('products.product');
        res.status(200).json({ status: 'success', payload: carts });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// UPDATE: agregar un producto al carrito (o incrementar su cantidad si ya existe)
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;

        const product = await Product.findById(pid);
        if (!product) {
            return res.status(404).json({ status: 'error', message: 'El producto a agregar no existe' });
        }

        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }

        const existingItem = cart.products.find(item => item.product.toString() === pid);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.products.push({ product: pid, quantity: 1 });
        }

        await cart.save();
        res.status(200).json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
});

// UPDATE: modificar la cantidad de un producto específico dentro del carrito
router.patch('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        if (typeof quantity !== 'number' || quantity < 1) {
            return res.status(400).json({ status: 'error', message: 'La cantidad debe ser un número mayor o igual a 1' });
        }

        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }

        const item = cart.products.find(item => item.product.toString() === pid);
        if (!item) {
            return res.status(404).json({ status: 'error', message: 'El producto no está en el carrito' });
        }

        item.quantity = quantity;
        await cart.save();
        res.status(200).json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
});

// DELETE: quitar un producto puntual del carrito
router.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;

        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }

        cart.products = cart.products.filter(item => item.product.toString() !== pid);

        await cart.save();
        res.status(200).json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// DELETE: vaciar el carrito completo
router.delete('/:cid', async (req, res) => {
    try {
        const cart = await Cart.findByIdAndUpdate(
            req.params.cid,
            { products: [] },
            { new: true }
        );

        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }

        res.status(200).json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

export default router;
```

**Desafío express para el grupo (dentro de este bloque):** antes de mostrar la solución de "incrementar cantidad si ya existe", preguntarle a los alumnos cómo resolverían ese caso con lo que ya saben de arrays en JavaScript. Es un buen momento para que propongan `find`, `some` o un `for` clásico antes de mostrar la solución con `.find()`.

**Nota de diseño:** validamos que el `user` exista al crear el carrito, pero no impedimos que un usuario tenga más de un carrito. Eso es intencional para esta clase: modela bien la relación 1 a N, aunque en un e-commerce real probablemente quieras un único carrito activo por usuario, lo cual seria un buen desafío adicional (ver Paso 9).

---

## Paso 7: Integración final y conexión a Atlas (10 min)

**Archivo: `src/app.js`**

```javascript
import express from 'express';
import mongoose from 'mongoose';
import usersRouter from './routes/users.router.js';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Reemplazar <usuario> y <password> con las credenciales reales de Atlas
const MONGO_URI = 'mongodb+srv://<usuario>:<password>@cluster0.mongodb.net/ecommerce?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Conexión a la base de datos establecida con éxito');

        app.use('/api/users', usersRouter);
        app.use('/api/products', productsRouter);
        app.use('/api/carts', cartsRouter);

        app.listen(PORT, () => {
            console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error crítico: No se pudo conectar a la base de datos.', error.message);
        process.exit(1);
    });
```

**Checkpoint:** en este punto, todos deberían tener el servidor levantado y conectado a Atlas sin errores en consola, con las tres rutas montadas.

---

## Paso 8: Pruebas end-to-end con Postman (10 min)

La idea de este bloque es simular el flujo real de un usuario comprando, encadenando los endpoints de Usuarios, Productos y Carrito.

1. **Crear un usuario** (`POST /api/users`):

```json
{
  "firstName": "Ada",
  "lastName": "Lovelace",
  "email": "ada@example.com",
  "age": 30,
  "password": "temporal123"
}
```

Guardar el `_id` que devuelve la respuesta.

2. **Crear un producto** (`POST /api/products`):

```json
{
  "title": "Notebook Lenovo ThinkPad E14",
  "description": "Notebook empresarial con procesador Intel Core i5, 16GB de RAM y SSD de 512GB.",
  "code": "LTP-E14-001",
  "price": 1299.99,
  "stock": 25,
  "category": "Tecnología"
}
```

Guardar el `_id` que devuelve la respuesta.

3. **Crear un segundo producto** para tener variedad, con otro `code` distinto.

4. **Crear un carrito asociado al usuario** (`POST /api/carts`), enviando en el body `{"user": "<id del usuario creado en el paso 1>"}`. Guardar el `_id` del carrito devuelto.

5. **Agregar el primer producto al carrito** (`POST /api/carts/:cid/product/:pid`), usando los `_id` guardados. Sin body.

6. **Agregar el mismo producto una segunda vez** al mismo carrito y observar que la cantidad pasa a 2 en lugar de duplicarse la entrada.

7. **Agregar el segundo producto** al carrito.

8. **Consultar el carrito completo** (`GET /api/carts/:cid`) y verificar que devuelve los productos completos y los datos básicos del usuario dueño, gracias al doble `populate`.

9. **Listar los carritos de ese usuario** (`GET /api/carts/user/:uid`) y confirmar que aparece el carrito recién creado.

10. **Actualizar la cantidad** de un producto (`PATCH /api/carts/:cid/product/:pid`) con body `{"quantity": 5}`.

11. **Eliminar un producto puntual del carrito** (`DELETE /api/carts/:cid/product/:pid`).

12. **Vaciar el carrito** (`DELETE /api/carts/:cid`) y confirmar con un `GET` que el array de productos quedó vacío.

**Sugerencia dinámica:** dividir la clase en parejas, donde uno hace las peticiones en Postman y el otro narra en voz alta qué se espera que pase antes de ejecutar cada request. Ayuda a que no sea una copia mecánica de pasos.

---

## Preguntas para entender


**1. ¿Qué ventaja concreta tiene usar `ref` y `populate` en vez de guardar los datos del producto o del usuario directamente dentro del carrito?**

La ventaja central es evitar la **duplicación y desincronización de datos**. Si copiáramos el `title`, `price`, etc. de un producto dentro de cada carrito que lo contiene, y después ese producto cambia de precio o de nombre, tendríamos que salir a actualizar manualmente todos los carritos que lo referencian, uno por uno. Con `ref` + `populate`, el carrito guarda solo un `ObjectId`, y cada vez que consultamos el carrito, Mongoose va a buscar la versión actual del producto o del usuario en su propia colección. Es la aplicación directa del principio de **normalización**: una sola fuente de verdad por entidad, y todo lo demás la referencia en lugar de copiarla.

Además, esto mantiene el tamaño de los documentos del carrito acotado (solo referencias + cantidad), en vez de ir creciendo con snapshots completos de cada producto agregado.

**2. ¿Qué pasaría si eliminamos un usuario de la colección `Users` mientras sigue referenciado en un carrito?**

Con el schema tal como está planteado, nada se rompe de forma automática, y ese es justamente el problema: MongoDB (a diferencia de una base relacional con foreign keys) **no tiene integridad referencial nativa**. Si borramos el usuario, el carrito sigue existiendo con un campo `user` que apunta a un `ObjectId` que ya no existe en ninguna colección. Ese carrito queda "huérfano".

Las consecuencias prácticas:
- Si hacemos `GET /api/carts/:cid` con `.populate('user', ...)`, el campo `user` va a venir como `null` (Mongoose no encuentra el documento referenciado), lo cual puede romper lógica del frontend que asuma que siempre hay un usuario ahí.
- No hay ningún mecanismo automático tipo `ON DELETE CASCADE` que borre o desasocie esos carritos.

Para resolverlo en una app real, hay dos caminos típicos: (a) borrado en cascada manual (al eliminar un usuario, buscar y eliminar o reasignar sus carritos), o (b) un middleware `pre('findOneAndDelete')` en el schema de Usuario que dispare esa limpieza. Es exactamente el tema que quedó abierto para la próxima clase.

**3. ¿Por qué elegimos PATCH y no PUT para actualizar productos y cantidades?**

Porque el endpoint recibe y aplica un **body parcial**: por ejemplo, `{"price": 1150}` o `{"quantity": 5}`, sin exigir el resto de los campos del documento. Eso es exactamente la semántica de PATCH: una modificación parcial sobre el recurso existente.

PUT, en cambio, implica **reemplazar el recurso completo**. Si usáramos PUT de forma estricta, el cliente debería mandar el objeto entero (todos los campos requeridos), y el servidor debería comportarse de forma idempotente reemplazando el documento tal cual llega. Como `findByIdAndUpdate` con un body parcial hace un merge, no un reemplazo, llamarlo PUT sería semánticamente incorrecto aunque funcione en la práctica. Usar PATCH deja el contrato del endpoint alineado con lo que realmente hace el código.

### Desafíos opcionales para practicar

1. Completar el CRUD de Usuarios con `PATCH /api/users/:uid` y `DELETE /api/users/:uid`, siguiendo el mismo patrón que Productos.
2. Restringir el modelo para que cada usuario tenga un único carrito activo (por ejemplo, agregando `unique: true` sobre `user` en el schema, o validando en el router antes de crear uno nuevo).
3. Agregar un endpoint `GET /api/products?category=Tecnología` para filtrar productos por categoría usando query params.
4. Agregar validación para que no se pueda agregar al carrito un producto con `stock: 0`.
5. Al agregar un producto al carrito, descontar automáticamente `1` del `stock` del producto correspondiente.
6. Hashear el `password` de Usuario con `bcrypt` antes de guardarlo, usando un middleware `pre('save')` en el schema.
