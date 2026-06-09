# Ecommerce API

API REST con Node.js + Express para gestión de productos y carritos.

## Instalación

```bash
npm install
```

## Ejecución

```bash
# Producción
npm start

# Desarrollo (con hot-reload)
npm run dev
```

El servidor queda disponible en `http://localhost:8080`.

Los archivos `data/products.json` y `data/carts.json` se crean automáticamente al guardar datos.

---

## Endpoints

### Productos `/api/products`

| Método | Ruta       | Descripción                   |
|--------|------------|-------------------------------|
| GET    | `/`        | Lista todos los productos     |
| GET    | `/:pid`    | Obtiene un producto por id    |
| POST   | `/`        | Crea un producto              |
| PUT    | `/:pid`    | Actualiza un producto         |
| DELETE | `/:pid`    | Elimina un producto           |

**Body para POST/PUT:**
```json
{
  "title": "Laptop Gamer",
  "description": "Alta performance",
  "code": "LP-100",
  "price": 1250.99,
  "status": true,
  "stock": 15,
  "category": "electronica",
  "thumbnails": []
}
```

### Carritos `/api/carts`

| Método | Ruta                     | Descripción                                   |
|--------|--------------------------|-----------------------------------------------|
| POST   | `/`                      | Crea un carrito vacío                         |
| GET    | `/:cid`                  | Lista los productos del carrito               |
| POST   | `/:cid/product/:pid`     | Agrega un producto (o incrementa su cantidad) |
