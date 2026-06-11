# Plantillas - Multer - Routing

## 1. Layouts en Handlebars

### ¿Qué es un layout?
Un layout es una plantilla base que actúa como envoltura común para todas las vistas de una aplicación. Contiene la estructura HTML repetitiva: `<!DOCTYPE html>`, `<html>`, `<head>`, `<body>`, barra de navegación, footer, enlaces a CSS/JS globales y el marcador especial `{{{body}}}` donde se inyecta el contenido de cada vista específica.

### ¿Por qué usar layouts?
- **Reutilización**: No repites el mismo código en cada vista.
- **Mantenibilidad**: Cambias la apariencia global modificando un solo archivo.
- **Consistencia**: Todas las páginas comparten la misma estructura base.
- **Separación de responsabilidades**: El layout se ocupa de la estructura; las vistas sólo del contenido específico.

### Funcionamiento interno
Cuando se renderiza una vista (ej. `catalog.handlebars`), el motor de Handlebars:
1. Carga el layout principal (por defecto `main.handlebars`).
2. Renderiza la vista solicitada y obtiene su HTML.
3. Inserta ese HTML en el lugar donde aparezca `{{{body}}}` dentro del layout.
4. Envía al cliente el documento completo.

### Personalización por vista
El layout puede recibir variables dinámicas desde cada ruta (ej. `title`, `cartCount`). Esto permite modificar el título de la pestaña, resaltar el ítem activo del menú, etc., sin duplicar el layout.

---

## 2. Handlebars Helpers

### Definición
Los helpers son funciones personalizadas que extienden la sintaxis de Handlebars para realizar operaciones lógicas o de formato que no están incluidas por defecto (cálculos, concatenación, comparaciones complejas, etc.).

### ¿Por qué son necesarios?
Handlebars por diseño evita incluir lógica de programación dentro de las plantillas. Solo ofrece `#if`, `#each`, `#unless` y algunos helpers básicos. Pero en aplicaciones reales necesitas:
- Multiplicar precio por cantidad (subtotal).
- Formatear fechas.
- Convertir texto a mayúsculas.
- Comparar valores con operadores (`>`, `<`, `===`).

### Registro de helpers
Los helpers se definen en el servidor (en la configuración de `express-handlebars`) y se pasan como un objeto al motor. Luego se usan en las plantillas con la sintaxis: `{{nombreHelper arg1 arg2}}`.

### Ejemplos conceptuales
- Helper `multiply` para calcular subtotal.
- Helper `formatDate` para mostrar fechas legibles.
- Helper `eq` para comparar igualdad (porque `#if` solo evalúa verdadero/falso).

---

## 3. Multer – Middleware para subida de archivos

### ¿Qué es Multer?
Multer es un middleware de Express diseñado específicamente para manejar peticiones con `multipart/form-data`, es decir, formularios que incluyen archivos. Permite recibir, validar y almacenar archivos en el servidor (localmente o en la nube).

### Componentes clave de configuración

| Componente | Función |
|------------|---------|
| `diskStorage` | Define el destino (carpeta) y el nombre del archivo guardado. |
| `fileFilter` | Función que valida si un archivo debe ser aceptado según su tipo, extensión, etc. |
| `limits` | Restricciones como tamaño máximo del archivo. |
| `upload.single(fieldName)` | Procesa un solo archivo proveniente de un input con ese nombre. |
| `upload.array(fieldName, maxCount)` | Procesa múltiples archivos. |
| `upload.fields([{name, maxCount}])` | Procesa diferentes campos de archivo. |

### Flujo de trabajo típico con Multer
1. El cliente envía un formulario con `enctype="multipart/form-data"`.
2. Express recibe la petición y aplica el middleware `upload.single(...)`.
3. Multer valida el archivo (tamaño, tipo) y lo guarda en el disco según la configuración de `storage`.
4. Multer añade el objeto `req.file` con metadatos (nombre original, nuevo nombre, ruta, tamaño, etc.).
5. En el controlador, accedes a `req.file` para obtener la URL pública y guardarla en tu base de datos asociada al producto/usuario.

### Consideraciones de seguridad
- Siempre validar el tipo de archivo (no confiar solo en la extensión).
- Limitar el tamaño máximo.
- Renombrar el archivo para evitar colisiones y ataques de path traversal.
- No almacenar archivos ejecutables en la misma carpeta que el código fuente.

### Multer vs carpeta pública
La carpeta donde Multer guarda los archivos debe ser servida como estática con `express.static` para que el navegador pueda acceder a las imágenes a través de una URL (ej. `/uploads/imagen.jpg`).

---

## 4. Routers en Express

### ¿Qué es un Router?
Un Router es una instancia de `express.Router()` que funciona como una "mini aplicación". Permite agrupar rutas relacionadas bajo un mismo prefijo y aplicar middlewares específicos solo a ese grupo.

### Ventajas arquitectónicas
- **Modularidad**: Cada entidad (productos, carrito, usuarios) tiene su propio archivo de rutas.
- **Escalabilidad**: Fácil agregar nuevas funcionalidades sin tocar `app.js`.
- **Aislamiento**: Puedes tener middlewares solo para ciertas rutas (ej. autenticación solo para `/api/admin`).

### Separación de responsabilidades
- **Routers de vistas**: Responden con `res.render()` y se montan en la raíz `/`.
- **Routers de API**: Responden con `res.json()` y se montan bajo `/api`.

### Orden de montaje
El orden en que montas los routers en `app.js` importa, especialmente si hay rutas que coinciden parcialmente (ej. `/catalogo` y `/catalogo/nuevo`). Express utiliza el primer match.

---

## 5. Archivos estáticos con Express

### Propósito
Servir recursos que no cambian (CSS, JavaScript del cliente, imágenes, fuentes) directamente desde el sistema de archivos, sin pasar por lógica de rutas.

### Configuración básica
`express.static(root)` crea un middleware que sirve archivos desde la carpeta `root`. Los archivos se acceden por su ruta relativa a esa carpeta.

### Prefijo virtual
Se puede montar el middleware en una ruta específica para ocultar la estructura real de carpetas:
```javascript
app.use('/recursos', express.static('public'))
```
Así, un archivo `public/imagen.jpg` se sirve en `/recursos/imagen.jpg`.

### Path absoluto recomendado
Usar `path.join(__dirname, 'public')` para que la ruta funcione independientemente del directorio desde donde se ejecute Node.js.

### Caché y rendimiento
`express.static` automáticamente envía cabeceras de caché (ETag, Last-Modified) para mejorar el rendimiento. Puedes configurar `maxAge` en opciones.

---

## 6. Variables dinámicas en layouts

### El problema
El layout es un solo archivo, pero cada vista puede necesitar cambiar el título de la página, la clase activa del menú o mostrar un contador (ej. items en el carrito).

### Solución
Todas las rutas que renderizan una vista pueden pasar variables adicionales que el layout utilizará. Por ejemplo:
- `title`: para el `<title>`.
- `cartCount`: para mostrar el número junto al enlace "Carrito".
- `activePage`: para resaltar el menú actual.

### Flujo de datos
El router que maneja la vista incluye esas variables en el objeto que pasa a `res.render()`. El layout las recibe automáticamente porque Handlebars las pone a disposición de todas las plantillas (layout y vista parcial).

### Buenas prácticas
Centralizar la lógica de cálculo de `cartCount` en un middleware de aplicación para no repetir código en cada router.

---

## 7. Comparativa: Handlebars vs Frameworks Frontend

| Aspecto | Handlebars (SSR) | React/Vue/Angular (CSR/SPA) |
|---------|------------------|------------------------------|
| **Dónde se renderiza** | Servidor | Navegador (cliente) |
| **Nivel de dinamismo** | Medio (websites, catálogos, blogs) | Alto (aplicaciones en tiempo real, dashboards) |
| **Actualización del DOM** | Completa (recarga de página o re-render completo) | Parcial (solo lo que cambia, Virtual DOM) |
| **SEO** | Excelente (HTML completo desde el servidor) | Requiere SSR adicional o prerendering |
| **Curva de aprendizaje** | Baja | Media-Alta |
| **Ideal para** | Landing pages, tiendas pequeñas, sistemas con poco estado en cliente | Aplicaciones ricas, chats, editores, dashboards interactivos |

### Regla de oro
- Si la página necesita cambios frecuentes en la interfaz sin recargar (filtros, carrito en tiempo real, animaciones complejas) → framework frontend.
- Si la mayoría del contenido es estático o cambia por navegación entre páginas → Handlebars es suficiente y más sencillo.
