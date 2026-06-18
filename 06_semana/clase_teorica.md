## WebSockets

**Protocolo Websocket vs. HTTP**
Websocket es un protocolo de comunicación basado en TCP que permite establecer una conexión persistente y bidireccional entre el cliente y el servidor. A diferencia de HTTP (unidireccional, basado en solicitud-respuesta), Websocket mantiene un canal abierto donde el servidor puede enviar información al cliente sin que este la solicite explícitamente. 
*Ejemplo conceptual:* El texto compara HTTP con un "walkie talkie" (se solicita y se espera respuesta), mientras que Websocket es como una "llamada telefónica" (canal abierto de doble vía). HTTP y Websocket no son sustitutos, sino complementos para sistemas complejos.

**Handshake (Apretón de Manos)**
Es el proceso inicial para establecer el canal Websocket. El cliente envía una solicitud HTTP estándar al servidor solicitando una actualización de protocolo ("Upgrade: websocket"). El servidor responde con el código de estado `HTTP/1.1 101 Switching Protocols`, confirmando el "acuerdo" o "contrato" de confianza. Tras este handshake, el canal queda abierto y persistente.

**Socket.IO**
Es una biblioteca de JavaScript que implementa el protocolo Websocket, proporcionando una API casi idéntica para cliente y servidor. Sus características destacadas son:
- **Fiabilidad:** Establece conexiones incluso en presencia de proxies, balanceadores de carga, firewalls o antivirus.
- **Reconexión Automática:** Un cliente desconectado intenta reconectarse hasta que el servidor esté disponible.
- **Detección de Desconexión:** Implementa un mecanismo de "heartbeat" para detectar si el otro extremo ya no responde.
- **Soporte Binario:** Puede emitir estructuras de datos serializables (ArrayBuffer, Blob, Buffer).

**Conceptos Clave para la Comunicación con Sockets**
- `socket.emit(evento, datos)`: Emisor de eventos (cliente o servidor). El nombre del evento debe ser idéntico al que se está escuchando en el otro extremo.
- `socket.on(evento, callback)`: Listener (receptor) de eventos. Escucha un evento de nombre idéntico al emitido por el otro extremo.
- `socketServer.emit(evento, datos)`: Emisor del servidor dirigido a *todos* los clientes conectados.
- `socket.broadcast.emit(evento, datos)`: Emisor del servidor dirigido a *todos* los clientes, excepto al socket raíz desde el cual se llamó el evento.
- `socket.emit(evento, datos)`: Emisor del servidor dirigido únicamente al socket individual conectado.

¡Hola! Me parece un excelente punto de partida. Tienes una base teórica muy sólida. Como docente, te digo que entender la diferencia entre HTTP (el "walkie-talkie") y WebSockets (la "llamada telefónica") es el 90% del trabajo. El otro 10% es no confundir a **quién** le estás enviando el mensaje.

Ese es el error más común en backend con Socket.IO: usar el emisor equivocado y terminar enviando un mensaje privado a todos, o un mensaje público a una sola persona.

Vamos a estructurar esta clase bajando la teoría a la práctica para tus dos escenarios: **el Chat** y **el Catálogo de Productos**.

---

### 1. La "Trinidad" de las Emisiones (Analogía del Aula)

Antes de ir al código, me gusta usar la analogía de un salón de clases donde el Servidor es el Profesor y los Clientes son los Alumnos.

1. **`socket.emit(evento, datos)` (Privado):** El profesor se acerca al pupitre de un alumno específico y le susurra algo al oído. Nadie más se entera.
2. **`socket.broadcast.emit(evento, datos)` (El Chisme):** Un alumno le dice algo al profesor, y el profesor lo repite en voz alta para toda la clase, **excepto** para el alumno que se lo dijo originalmente (porque él ya lo sabe).
3. **`io.emit(evento, datos)` (Megáfono global):** El profesor toma un megáfono y da un anuncio general. Absolutamente todos en el aula lo escuchan, incluyendo al profesor mismo. *(Nota: en tu resumen lo llamaste `socketServer.emit`, convencionalmente en la documentación oficial de Node se suele instanciar como `io.emit`)*.

---

### 2. Caso Práctico 1: La Sala de Chat

En un chat, necesitas usar las tres herramientas estratégicamente para no saturar la red y dar una buena experiencia de usuario.

* **Cuando un usuario entra al chat (`socket.emit`):**
Apenas el cliente se conecta, el servidor detecta el handshake. En ese preciso instante, el servidor lee el historial de mensajes de la base de datos y se lo envía **solo a ese cliente**. No tiene sentido enviarle el historial a los que ya estaban conectados.
* *Backend:* `socket.emit('historial_chat', mensajes_guardados);`


* **Notificar que alguien entró (`socket.broadcast.emit`):**
El nuevo usuario ya vio los mensajes, ahora hay que avisarle al resto que llegó alguien. No le envías este aviso al usuario nuevo (porque él ya sabe que entró).
* *Backend:* `socket.broadcast.emit('notificacion', 'Un nuevo usuario se ha conectado');`


* **Enviar un mensaje (`io.emit`):**
El usuario nuevo escribe "¡Hola a todos!" y le da a enviar (`socket.emit` desde el frontend al backend). El servidor recibe el evento, guarda el mensaje en la base de datos, y ahora debe actualizar la pantalla de **todos** para que vean el mensaje.
* *Backend:* `io.emit('nuevo_mensaje', { user: 'Juan', text: '¡Hola a todos!' });`


---

### 3. Caso Práctico 2: Productos en Tiempo Real (con JSON)

Este caso es interesantísimo porque involucra persistencia en archivos (`productos.json`). Imagina una vista de administrador y una vista de cliente.

* **Carga inicial de productos (`socket.emit`):**
Igual que en el chat, cuando un cliente abre la página `/productos`, el servidor usa el módulo `fs` (File System) de Node.js para leer el archivo `productos.json`. Una vez leído, le envía la lista actual solo a ese cliente para que renderice sus tarjetas de producto.
* *Backend:* `socket.emit('lista_inicial', productos_json);`


* **Crear/Eliminar un producto (`io.emit`):**
Imagina que el administrador agrega un nuevo producto desde un formulario. El backend recibe los datos, modifica el archivo `productos.json` (lo sobrescribe para guardar los cambios). Una vez que el archivo se guardó con éxito, el servidor usa su "megáfono" para avisarle a **todos los clientes conectados** (incluyendo al administrador que lo creó) que hay una nueva lista de productos.
* *Backend:* `io.emit('actualizacion_productos', nueva_lista_json);`
* *Frontend:* Al recibir `'actualizacion_productos'`, el motor de plantillas (como Handlebars) o tu JavaScript de lado del cliente limpia la pantalla y vuelve a pintar los productos.


Para que este concepto de hacia dónde viaja la información quede totalmente claro para tus alumnos (o para ti), he preparado un simulador interactivo de la topología de red de Socket.IO.
