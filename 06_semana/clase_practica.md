## Practica e Implementación para el proyecto

**Configuración de Infraestructura y Dependencias**
1.  **Estructura de carpetas:** El proyecto requiere la arquitectura `src/` conteniendo `public/`, `routes/`, `views/`, `app.js`, `utils.js` y `package.json`.
2.  **Instalación:** Se utiliza el comando de terminal `npm install express express-handlebars socket.io`.

**Configuración del Servidor Express con Handlebars y Socket.IO (`app.js`)**
El código fuente especifica las siguientes importaciones y configuraciones:
```javascript
import express from 'express';
import __dirname from './utils.js';
import handlebars from 'express-handlebars';
import viewsRouter from './routes/views.router.js';
import { Server } from 'socket.io'; // Importación específica de socket.io

const app = express();
const httpServer = app.listen(8080, () => console.log("Listening on PORT 8080"));
const socketServer = new Server(httpServer); // Nota: El nombre "socketServer" o "io" es indiferente, por convención se usa "io".

// Configuración de Handlebars y estáticos
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));
app.use('/', viewsRouter);
```
*Nota:* El archivo `utils.js` debe exportar el `__dirname` utilizando `fileURLToPath` y `dirname` de las librerías `url` y `path` para entornos con `type: module`.

**Integración del Cliente en las Vistas**
Dentro de la plantilla `views/index.handlebars`, el texto establece un orden crítico:
1.  `<script src="/socket.io/socket.io.js"></script>` (El script del cliente de socket.io debe cargarse primero).
2.  `<script src="/js/index.js"></script>` (El script lógico propio del cliente, ubicado en `public/js/index.js`).

**Comunicación Bidireccional Cliente-Servidor (Primer Contacto)**
- **Del Cliente al Servidor:** En `public/js/index.js`, el cliente instancia el socket (`const socket = io();`) y envía su primer mensaje: `socket.emit('message', '¡Hola, me estoy comunicando desde un websocket!');`.
- **Del Servidor al Cliente:** En `app.js`, el servidor escucha la conexión entrante y el evento específico:
  ```javascript
  socketServer.on('connection', socket => {
      console.log("Nuevo cliente conectado");
      socket.on('message', data => {
          console.log(data); // El servidor imprime el mensaje recibido en consola.
      });
  });
  ```

**Estrategias de Emisión del Servidor (Tres formas explícitas)**
El documento proporciona un bloque de código para el servidor donde se detallan las tres modalidades:
1.  `socket.emit('evento_para_socket_individual', 'Mensaje solo para el socket');` (Unicast).
2.  `socket.broadcast.emit('evento_para_todos_menos_el_socket_actual', 'Mensaje para todos excepto el que envía');` (Broadcast excluyente).
3.  `socketServer.emit('evento_para_todos', 'Mensaje para todos los sockets');` (Broadcast global).



**Integración de SweetAlert2 para Autenticación**

> No es algo completamente necesario pero se puede usar.

1.  **Instalación:** Se añade la etiqueta `<script src="//cdn.jsdelivr.net/npm/sweetalert2@11"></script>` en `index.handlebars`.
2.  **Configuración del Bloqueo:** Se implementa `Swal.fire` en `index.js` para solicitar el nombre de usuario antes de permitir la interacción:
   ```javascript
   Swal.fire({
       title: "Identificate",
       input: "text",
       text: "Ingresa el usuario para identificarte en el chat",
       inputValidator: (value) => {
           return !value && '¡Necesitas escribir un nombre de usuario para continuar!';
       },
       allowOutsideClick: false
   }).then(result => {
       user = result.value; // Asignación del usuario a una variable global.
   });
   ```

**Implementación del Sistema de Chat Comunitario (CoderChat)**
1.  **Vista:** `index.handlebars` se modifica para incluir un `<h1>`, un `<input id="chatBox">` y un `<p id="messageLogs">`.
2.  **Lógica del Cliente (`index.js`):**
    *   Se captura el evento `keyup` del `chatBox`.
    *   Si la tecla presionada es "Enter" y el input no está vacío:
        *   Se emite el objeto `socket.emit('message', { user: user, message: chatBox.value });`.
        *   Se limpia el input: `chatBox.value = "";`.
3.  **Lógica del Servidor (`app.js`):**
    *   Se inicializa un array global para persistencia en memoria: `let messages = [];`.
    *   El servidor escucha el evento 'message':
      ```javascript
      socket.on('message', data => {
          messages.push(data); // Almacena el objeto { user, message }.
          io.emit('messageLogs', messages); // Reenvía el array completo a todos los clientes.
      });
      ```
4.  **Renderizado en Cliente:** El cliente escucha el evento `messageLogs` y utiliza un bucle `forEach` para reconstruir el HTML e insertarlo en el `messageLogs` con el formato `${message.user} dice: ${message.message}`.

**Ejercicio Práctico Ampliado (Actividad en Clase)**
El texto propone una extensión del chat basada en el proyecto desarrollado, con los siguientes requerimientos explícitos:
1.  Almacenar los mensajes como objetos con la estructura `{ socketid: (el socket.id del que envió el mensaje), mensaje: (texto enviado) }`.
2.  Enviar la lista de mensajes completa a cada nuevo cliente que se conecte.
3.  Modificar el input del cliente para que disponga de un botón de envío de mensaje (no solo la tecla Enter).
4.  Representar cada mensaje en un renglón aparte, anteponiendo el `socket.id`.
5.  **Característica adicional requerida:** Cuando un usuario se autentique correctamente, el servidor debe enviarle los logs de todo el chat. Además, todos los demás usuarios (excepto el recién registrado) deben recibir una notificación Toast con `Swal.fire({ text:"Nuevo usuario conectado", toast:true, position:"top-right" })`.

**Despliegue en Glitch.com**
1.  **Preparación:** Subir el código a un repositorio público de GitHub. Se debe excluir `node_modules` e incluir el script `"start"` en el `package.json`.
2.  **Importación:** Crear una cuenta en Glitch, hacer clic en "New project" y seleccionar "Import from GitHub", pegando el enlace del repositorio.
3.  **Solución de Errores Comunes:** Si el despliegue falla, el texto indica revisar los "LOGS". Un error típico es la versión del core de Node.js. La solución recomendada es modificar el archivo `package.json` en la sección `"engines"` para establecer `"node": "14.x"` (o `15.x`).
4.  **Publicación:** Una vez que el proyecto esté operativo, se debe hacer clic en el botón "Share". Dentro de "Project links", la opción "Live site" proporciona el enlace público que se puede compartir.