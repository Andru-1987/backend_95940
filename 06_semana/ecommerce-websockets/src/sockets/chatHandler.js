// El estado del chat vive en este módulo --> por ahora en memoria
let historialMensajes = [];

export default function registerChatHandlers(io, socket) {
    // A) Enviar historial al conectar
    socket.emit('historial_chat', historialMensajes);

    // B) Avisar que alguien entró
    socket.broadcast.emit('notificacion', 'Un nuevo usuario se ha unido al chat.');

    // C) Escuchar y emitir mensajes
    socket.on('mensaje_cliente', (data) => {
        const nuevoMensaje = {
            id: socket.id,
            usuario: data.usuario || 'Anónimo',
            texto: data.texto,
            fecha: new Date().toLocaleTimeString()
        };
        
        historialMensajes.push(nuevoMensaje);
        io.emit('mensaje_servidor', nuevoMensaje);
    });

    
    // Logica de "Typing"
    socket.on('typing',usuario=>{
        socket.broadcast.emit('usuario_typing', usuario)
    })
    
    
    socket.on('stop_typing', ()=>{
        socket.broadcast.emit('usuario_stop_typing')
    })
}