#  PROYECTO DE INTEGRACIÓN

A continuación el proyecto completo funcionando con ES6.

## Estructura del proyecto

```
mi-tienda-es6/
├── src/
│   ├── public/
│   │   ├── css/
│   │   │   └── style.css
│   │   └── uploads/               # Carpeta donde Multer guarda imágenes
│   ├── routes/
│   │   ├── catalog.router.js
│   │   ├── cart.router.js
│   │   └── upload.router.js
│   ├── views/
│   │   ├── layouts/
│   │   │   └── main.handlebars
│   │   ├── catalog.handlebars
│   │   ├── cart.handlebars
│   │   └── upload.handlebars
│   ├── data.js
│   └── app.js
├── package.json
└── package-lock.json
```

---

## 1. `package.json`

```json
{
  "name": "mi-tienda-es6",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node src/app.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "express-handlebars": "^7.0.0",
    "multer": "^1.4.5-lts.1"
  }
}
```

---

## 2. `src/app.js`

```javascript
import express from 'express';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Helper personalizado
const helpers = {
    multiply: (a, b) => a * b
};

// Configuración de Handlebars con layout
app.engine('handlebars', engine({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    helpers
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Middlewares para formularios
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Importar routers
import catalogRouter from './routes/catalog.router.js';
import cartRouter from './routes/cart.router.js';
import uploadRouter from './routes/upload.router.js';

app.use('/catalogo', catalogRouter);
app.use('/carrito', cartRouter);
app.use('/subir', uploadRouter);

app.get('/', (req, res) => res.redirect('/catalogo'));

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor ES6 corriendo en http://localhost:${PORT}`));
```

---

## 3. `src/data.js`

```javascript
export const products = [
    { id: 1, name: 'Laptop Gamer', price: 1200, image: '/uploads/laptop.jpg' },
    { id: 2, name: 'Mouse Inalámbrico', price: 45, image: '/uploads/mouse.jpg' },
    { id: 3, name: 'Teclado Mecánico', price: 95, image: '/uploads/teclado.jpg' }
];

export let cart = [];
```

---

## 4. `src/routes/catalog.router.js`

```javascript
import express from 'express';
import { products, cart } from '../data.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.render('catalog', {
        title: 'Catálogo',
        products,
        cartCount: cart.reduce((acc, item) => acc + item.quantity, 0)
    });
});

router.get('/add/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const product = products.find(p => p.id === productId);
    if (product) {
        const existing = cart.find(item => item.id === productId);
        if (existing) existing.quantity++;
        else cart.push({ ...product, quantity: 1 });
    }
    res.redirect('/catalogo');
});

export default router;
```

---

## 5. `src/routes/cart.router.js`

```javascript
import express from 'express';
import { cart } from '../data.js';

const router = express.Router();

router.get('/', (req, res) => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    res.render('cart', {
        title: 'Mi Carrito',
        cart,
        total,
        cartCount: cart.reduce((acc, item) => acc + item.quantity, 0)
    });
});

router.get('/remove/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = cart.findIndex(item => item.id === id);
    if (index !== -1) cart.splice(index, 1);
    res.redirect('/carrito');
});

router.get('/clear', (req, res) => {
    cart.length = 0;
    res.redirect('/carrito');
});

export default router;
```

---

## 6. `src/routes/upload.router.js`

```javascript
import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { products } from '../data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const extname = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowed.test(file.mimetype);
    if (extname && mimetype) return cb(null, true);
    cb(new Error('Solo imágenes'));
};

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter
});

router.get('/', (req, res) => {
    res.render('upload', { title: 'Subir imagen', cartCount: 0 });
});

router.post('/', upload.single('productImage'), (req, res) => {
    if (!req.file) return res.status(400).send('No se recibió archivo');
    const imageUrl = `/uploads/${req.file.filename}`;
    res.render('upload', {
        title: 'Subir imagen',
        message: 'Imagen subida exitosamente',
        imageUrl,
        cartCount: 0
    });
});

// Extensión: agregar producto con imagen
router.post('/add-product', upload.single('productImage'), (req, res) => {
    if (!req.file) return res.status(400).send('Error en la imagen');
    const newProduct = {
        id: products.length + 1,
        name: req.body.productName || 'Producto nuevo',
        price: parseFloat(req.body.price) || 0,
        image: `/uploads/${req.file.filename}`
    };
    products.push(newProduct);
    res.redirect('/catalogo');
});

export default router;
```

---

## 7. Vistas (Handlebars)

### `views/layouts/main.handlebars`

```handlebars
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>{{title}} | Mi Tienda</title>
    <link rel="stylesheet" href="/css/style.css">
</head>
<body>
    <header>
        <nav>
            <a href="/catalogo">Catálogo</a>
            <a href="/carrito">Carrito ({{cartCount}})</a>
            <a href="/subir">Subir imagen</a>
        </nav>
    </header>
    <main>
        {{{body}}}
    </main>
    <footer>Proyecto Handlebars + Multer (ES6)</footer>
</body>
</html>
```

### `views/catalog.handlebars`

```handlebars
<h1>Nuestros Productos</h1>
<div class="product-grid">
    {{#each products}}
    <div class="product-card">
        <img src="{{this.image}}" alt="{{this.name}}" width="150">
        <h3>{{this.name}}</h3>
        <p>${{this.price}}</p>
        <a href="/catalogo/add/{{this.id}}" class="btn">Agregar al carrito</a>
    </div>
    {{/each}}
</div>
```

### `views/cart.handlebars`

```handlebars
<h1>Carrito de Compras</h1>
{{#if cart.length}}
<table>
    <thead>
        <tr><th>Producto</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th><th></th></tr>
    </thead>
    <tbody>
    {{#each cart}}
        <tr>
            <td>{{this.name}}</td>
            <td>${{this.price}}</td>
            <td>{{this.quantity}}</td>
            <td>${{multiply this.price this.quantity}}</td>
            <td><a href="/carrito/remove/{{this.id}}">Eliminar</a></td>
        </tr>
    {{/each}}
    </tbody>
</table>
<p><strong>Total: ${{total}}</strong></p>
<a href="/carrito/clear">Vaciar carrito</a>
{{else}}
<p>El carrito está vacío.</p>
{{/if}}
<a href="/catalogo">Seguir comprando</a>
```

### `views/upload.handlebars` (básico + extensión)

```handlebars
<h1>Subir imagen de producto</h1>
<form action="/subir" method="POST" enctype="multipart/form-data">
    <input type="file" name="productImage" accept="image/*" required>
    <button type="submit">Subir solo imagen</button>
</form>

<h2>O crear producto completo</h2>
<form action="/subir/add-product" method="POST" enctype="multipart/form-data">
    <input type="text" name="productName" placeholder="Nombre" required>
    <input type="number" step="0.01" name="price" placeholder="Precio" required>
    <input type="file" name="productImage" accept="image/*" required>
    <button type="submit">Crear producto</button>
</form>

{{#if message}}
<div class="success">
    <p>{{message}}</p>
    {{#if imageUrl}}
        <img src="{{imageUrl}}" alt="Subida" width="200">
    {{/if}}
</div>
{{/if}}
```

---

## 8. `public/css/style.css`

```css
body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
header { background: #333; padding: 1rem; }
nav a { color: white; margin-right: 1rem; text-decoration: none; }
.product-grid { display: flex; gap: 1rem; flex-wrap: wrap; }
.product-card { border: 1px solid #ddd; padding: 1rem; width: 200px; }
table { border-collapse: collapse; width: 100%; }
th, td { border: 1px solid #ddd; padding: 0.5rem; }
.btn { background: #007bff; color: white; padding: 0.3rem 0.6rem; text-decoration: none; }
.success { background: #d4edda; padding: 1rem; margin-top: 1rem; }
```

---

## 9. Ejecutar

```bash
npm install
npm start
```

Abrir `http://localhost:3000`

---

## Conclusión de la parte práctica

El proyecto demuestra:
- Uso de layout en Handlebars.
- Helper personalizado `multiply`.
- Multer con almacenamiento local y validación.
- Routers modulares con ES6.
- Servicio de archivos estáticos.
- Variables dinámicas compartidas entre layout y vistas.