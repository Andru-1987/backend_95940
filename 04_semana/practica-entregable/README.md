# Entrega N°1: API para gestión de productos y carritos

## Objetivo

Construir un servidor (API) básico usando **Node.js + Express** que permita:
- **Administrar productos** (crear, leer, actualizar, eliminar).
- **Administrar carritos de compra** (crear carrito, ver productos en un carrito, agregar productos a un carrito).

Los datos se guardarán en archivos `.json` (productos y carritos).  
No necesitas una interfaz visual; puedes probar todo con **Insomnia** o cualquier cliente HTTP.

---

## Requisitos técnicos

> No hace falta tener la version para esta api

- **Puerto**: `8080`
- **Rutas base**:
  - `/api/products` → manejo de productos
  - `/api/carts` → manejo de carritos
- **Persistencia**: Archivos `products.json` y `carts.json` (se crean automáticamente al guardar datos).
- **Herramientas recomendadas**: Node.js, Express, File System (fs) nativo.

---

## Endpoints y su comportamiento

### 1. Rutas de productos (`/api/products`)

| Método | Ruta              | ¿Qué hace? |
|--------|-------------------|-------------|
| GET    | `/`               | Lista **todos** los productos. |
| GET    | `/:pid`           | Muestra el producto con el `id` indicado. |
| POST   | `/`               | Agrega un **nuevo producto**. Los campos obligatorios se envían en el cuerpo (body) de la petición. El `id` se genera automáticamente. |
| PUT    | `/:pid`           | Actualiza los campos de un producto existente (excepto el `id`). |
| DELETE | `/:pid`           | Elimina el producto con el `id` indicado. |

#### Estructura de un producto (schema)

| Campo         | Tipo               | Obligatorio | Observación                                     |
|---------------|--------------------|-------------|-------------------------------------------------|
| `id`          | number o string    | automático  | Se genera sin repetir (ej: timestamp + random). |
| `title`       | string             | sí          |                                                 |
| `description` | string             | sí          |                                                 |
| `code`        | string             | sí          | Código único del producto.                      |
| `price`       | number             | sí          |                                                 |
| `status`      | boolean            | sí          | `true` = habilitado, `false` = deshabilitado.   |
| `stock`       | number             | sí          | Cantidad disponible.                            |
| `category`    | string             | sí          |                                                 |
| `thumbnails`  | array de strings   | no          | Rutas (URLs) de imágenes.                       |

**Ejemplo de producto (formato JSON):**
```json
{
  "id": "prod_1",
  "title": "Laptop Gamer",
  "description": "Alta performance para data science",
  "code": "LP-100",
  "price": 1250.99,
  "status": true,
  "stock": 15,
  "category": "electrónica",
  "thumbnails": ["http://.../img1.jpg", "http://.../img2.jpg"]
}
```

---

### 2. Rutas de carritos (`/api/carts`)

| Método | Ruta                         | ¿Qué hace? |
|--------|------------------------------|-------------|
| POST   | `/`                          | Crea un **nuevo carrito vacío**. El `id` del carrito se genera automáticamente. |
| GET    | `/:cid`                      | Muestra la lista de productos dentro del carrito con `id` = `cid`. |
| POST   | `/:cid/product/:pid`         | Agrega el producto `pid` al carrito `cid`. Si el producto ya estaba en el carrito, **aumenta su cantidad** en 1. |

#### Estructura de un carrito (schema)

| Campo      | Tipo               | Descripción |
|------------|--------------------|-------------|
| `id`       | number o string    | Identificador único del carrito (autogenerado). |
| `products` | array de objetos   | Cada objeto representa un producto dentro del carrito. |

**Formato de cada objeto dentro de `products`:**

| Campo      | Tipo   | Descripción |
|------------|--------|-------------|
| `product`  | string/number | `id` del producto (referencia a un producto existente). |
| `quantity` | number | Cantidad de ejemplares de ese producto en el carrito. |

**Ejemplo de carrito (formato JSON):**
```json
{
  "id": "cart_7",
  "products": [
    { "product": "prod_1", "quantity": 3 },
    { "product": "prod_22", "quantity": 1 }
  ]
}
```

> **Importante**  
> Al agregar un producto que ya existe en el carrito, **no** crees un nuevo objeto. Solo incrementa `quantity` en 1.

---

## Persistencia – Manejo de archivos

Deberás implementar dos módulos (clases) que trabajen con el sistema de archivos:

- **`ProductManager`**  
  - Responsable de leer/escribir `products.json`.  
  - Métodos: `getProducts()`, `getProductById(id)`, `addProduct(product)`, `updateProduct(id, updates)`, `deleteProduct(id)`.

- **`CartManager`**  
  - Responsable de leer/escribir `carts.json`.  
  - Métodos: `createCart()`, `getCartById(id)`, `addProductToCart(cartId, productId)`.

Los archivos JSON deben guardarse en el mismo directorio del proyecto (o en una carpeta `/data`). Si no existen al inicio, se crean vacíos.

---
## Relacion de los modelos

- Un **carrito** tiene muchos **productos** (cada uno con una cantidad).  
- Un **producto** puede estar en muchos carritos.

---

## ¿Qué debes entregar?

- Un enlace a un repositorio **público** de GitHub.
- El repositorio debe contener **todo el código fuente**.
- **No** incluir la carpeta `node_modules`.
- Incluir un archivo `README.md` con instrucciones básicas de instalación y ejecución.

---

## Consejos para empezar (Data Science)

1. **Inicializa un proyecto Node**:  
   `npm init -y`  
   Luego instala Express: `npm install express`

2. **Estructura sugerida**:
   ```
   ├── src/
   │   ├── managers/
   │   │   ├── ProductManager.js
   │   │   └── CartManager.js
   │   ├── routes/
   │   │   ├── products.routes.js
   │   │   └── carts.routes.js
   │   └── app.js
   ├── data/          (se creará automáticamente)
   ├── package.json
   └── README.md
   ```

3. **Prueba con Postman|Insomnia**  
   - Envía peticiones a `http://localhost:8080/api/products/` y `http://localhost:8080/api/carts/`.
