## Ejercicio 1: Layouts en Handlebars (Estructura Base)

**Objetivo:** Comprender cómo un layout envuelve las vistas específicas para evitar la duplicación de código HTML.

**Consigna para la clase:**

1. Configura el motor de plantillas `express-handlebars` en tu servidor Express.
2. Crea un archivo de layout principal llamado `main.handlebars` dentro de la carpeta `views/layouts`. Este archivo debe contener la estructura básica de un documento HTML5, una barra de navegación `<nav>` genérica y un `<footer>`.
3. Utiliza el marcador `{{{body}}}` en el centro del `main.handlebars`.
4. Crea una vista llamada `catalog.handlebars` en la carpeta `views` que contenga únicamente un `<h1>` con el texto "Catálogo de Productos" y un párrafo descriptivo.
5. Define una ruta `GET /catalogo` que renderice la vista `catalog`. Verifica en el navegador que el contenido de la vista aparece correctamente envuelto por el navbar y el footer del layout.

---

## Ejercicio 2: Handlebars Helpers (Lógica en las Vistas)

**Objetivo:** Implementar funciones personalizadas en el servidor para resolver operaciones matemáticas simples dentro de la plantilla.

**Consigna para la clase:**

1. Al momento de inicializar `express-handlebars` en tu archivo principal, registra un helper personalizado llamado `calcularSubtotal`.
2. Este helper debe recibir dos parámetros (precio y cantidad) y retornar el resultado de su multiplicación usando una función flecha (arrow function) de ES6.
3. Crea una vista `cart.handlebars`. Simula en tu ruta `GET /carrito` el envío del siguiente array de objetos:
`const items = [{ nombre: 'Teclado', precio: 50, cantidad: 2 }, { nombre: 'Mouse', precio: 20, cantidad: 3 }];`
4. En la vista, utiliza el bloque `{{#each items}}` para iterar sobre los productos y usa tu helper `{{calcularSubtotal this.precio this.cantidad}}` para mostrar cuánto cuesta cada línea de producto.

---

## Ejercicio 3: Multer (Subida de Archivos)

**Objetivo:** Configurar un middleware para recibir, renombrar y guardar imágenes en el disco del servidor.

**Consigna para la clase:**

1. Instala el paquete `multer` e impórtalo en tu archivo principal.
2. Configura el motor de almacenamiento de Multer (`multer.diskStorage`). Utiliza ES6 para definir las funciones `destination` (apuntando a una carpeta llamada `uploads/`) y `filename`.
3. En la función `filename`, asegúrate de que el archivo guardado tenga un nombre único concatenando `Date.now()` con el nombre original del archivo (`file.originalname`).
4. Crea una ruta `POST /api/productos/imagen` y aplícale el middleware configurado usando `upload.single('imagenProducto')`.
5. Dentro del controlador de la ruta, responde al cliente con un JSON que contenga un mensaje de éxito y la ruta final donde se guardó el archivo accediendo a `req.file.path`. Pruébalo enviando un archivo desde Postman o Thunder Client.

---

## Ejercicio 4: Archivos Estáticos con Express

**Objetivo:** Servir recursos estáticos protegiendo la estructura real de carpetas del proyecto mediante prefijos virtuales.

**Consigna para la clase:**

1. Crea una carpeta llamada `public` en la raíz de tu proyecto. Dentro de ella, crea otra carpeta llamada `css` y añade un archivo `styles.css` con algunas reglas básicas (por ejemplo, cambiar el color de fondo del `body`).
2. En tu archivo principal de Express, utiliza el middleware `express.static()` para servir la carpeta `public`.
3. **El desafío:** Monta este middleware bajo el prefijo virtual `/recursos`. Debes usar el módulo nativo `path` y ES6 (`path.join(__dirname, 'public')`) para asegurar que la ruta sea absoluta.
4. Modifica tu layout `main.handlebars` (del Ejercicio 1) para enlazar la hoja de estilos. El `<link>` debe apuntar a `/recursos/css/styles.css`. Verifica que los estilos se apliquen correctamente en el navegador.

---

## Ejercicio 5: Variables Dinámicas en Layouts

**Objetivo:** Inyectar datos específicos desde una ruta particular hacia el layout global sin modificar la estructura del layout.

**Consigna para la clase:**

1. Modifica el layout `main.handlebars` para que la etiqueta `<title>` del head reciba una variable dinámica llamada `{{title}}`.
2. En la barra de navegación de ese mismo layout, agrega un indicador de carrito que muestre la cantidad de ítems utilizando una variable `{{cartCount}}`.
3. Crea dos rutas distintas usando funciones flecha en ES6: `GET /home` y `GET /perfil`.
4. En el método `res.render()` de la ruta `/home`, pasa un objeto de contexto: `{ title: 'Inicio - Mi Tienda', cartCount: 5 }`.
5. En la ruta `/perfil`, pasa el contexto: `{ title: 'Perfil de Usuario', cartCount: 5 }`.
6. Navega entre ambas rutas y observa cómo el layout cambia dinámicamente su título de pestaña de acuerdo a la ruta visitada, mientras el contador del carrito se mantiene integrado en la navegación.
