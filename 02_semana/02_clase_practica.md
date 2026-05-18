# Clase Práctica — Ticket & User Manager

# Objetivo

Construir un sistema backend simple en memoria utilizando:

- Clases
- Arrays
- Objetos
- Métodos
- ES6+
- Validaciones

---

# Estructura

```text
src/
│
├── app.js
│
└── managers/
    ├── UserManager.js
    └── TicketManager.js
```

---

# Arquitectura

```text
app.js
│
├── UserManager
│    └── users[]
│
└── TicketManager
     └── events[]
```

---

# Parte 1 — UserManager

## Objetivo

Administrar usuarios.

---

# Estructura esperada

```js
{
    id: 1,
    nombre: "Anderson",
    email: "anderson@test.com"
}
```

---

# Métodos requeridos

| Método | Descripción |
|---|---|
| createUser() | Crear usuario |
| getUsers() | Obtener usuarios |
| getUserById() | Buscar por ID |

---

# Reglas

| Validación | Acción |
|---|---|
| Email repetido | Error |
| ID | Autoincremental |

---

# Parte 2 — TicketManager

## Objetivo

Administrar eventos y participantes.

---

# Estructura esperada

```js
{
    id: 1,
    nombre: "JS Conf",
    lugar: "Buenos Aires",
    precio: 115,
    participantes: []
}
```

---

# Variable privada

```js
#precioBaseGanancia = 0.15
```

---

# Métodos requeridos

| Método | Descripción |
|---|---|
| createEvent() | Crear evento |
| getEvents() | Obtener eventos |
| addUserToEvent() | Registrar usuario |
| createEventTour() | Duplicar evento |

---

# Validaciones

| Validación | Acción |
|---|---|
| Evento inexistente | Error |
| Usuario repetido | Error |
| Precio negativo | Error |

---

# Flujo esperado

```text
Crear usuarios
        │
        ▼
Crear eventos
        │
        ▼
Registrar usuarios
        │
        ▼
Duplicar evento (tour)
        │
        ▼
Mostrar resultados
```

---

# app.js

## 1. Crear managers

```js
const userManager = new UserManager()
const ticketManager = new TicketManager()
```

---

## 2. Crear usuarios

```js
userManager.createUser(
    "Anderson",
    "anderson@test.com"
)
```

---

## 3. Crear eventos

```js
ticketManager.createEvent(
    "Node Summit",
    "Buenos Aires",
    100
)
```

---

## 4. Registrar usuarios

```js
ticketManager.addUserToEvent(1, 1)
```

---

## 5. Crear gira

```js
ticketManager.createEventTour(
    1,
    "Córdoba"
)
```

---

# Diagrama — Relación

```text
UserManager
│
└── users[]
      │
      └── user.id
              │
              ▼
TicketManager
│
└── events[]
      │
      └── participantes[]
```

---

# Bonus

| Nivel | Objetivo |
|---|---|
| 1 | Más validaciones |
| 2 | Eliminar usuarios/eventos |
| 3 | Persistencia JSON |
| 4 | File System |
| 5 | Modularización avanzada |

---

# Conceptos aplicados

| Concepto | Uso |
|---|---|
| Clases | Managers |
| Arrays | Persistencia |
| Objetos | Users/Events |
| Métodos | CRUD |
| Spread Operator | Tours |
| Variables privadas | Ganancia |
| Arrow Functions | Búsquedas |
| ES6 | Sintaxis moderna |

---

# Resultado esperado

El estudiante deberá poder:

- Modelar entidades
- Trabajar con clases
- Aplicar ES6+
- Manipular arrays y objetos
- Construir lógica backend básica
