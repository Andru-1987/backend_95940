## 1. Resumen de la Clase: Optimizando MongoDB

En esta unidad abordamos cómo escalar y optimizar nuestras bases de datos para manejar entornos de producción reales:

* **Indexación:** La herramienta fundamental para evitar que MongoDB haga un escaneo completo de la colección (Collection Scan). Al aplicar índices a campos específicos, creamos estructuras B-tree que reducen los tiempos de búsqueda de milisegundos a prácticamente cero. Aprendimos sobre índices simples, compuestos, de texto y geoespaciales.
* **Populations:** El equivalente a los "Joins" relacionales, pero adaptado a la filosofía NoSQL. Consiste en guardar la referencia (el `_id`) de un documento en otro y usar el método `.populate()` de Mongoose para "hidratar" o traer la información completa del documento referenciado al momento de la consulta.
* **Aggregations:** El motor de procesamiento de datos de MongoDB. Funciona mediante *pipelines* (tuberías) donde los datos pasan por múltiples etapas (`$match`, `$group`, `$sort`) para ser transformados, filtrados o resumidos, ideal para reportes y analítica.
* **Paginación:** La técnica obligatoria para enviar datos al cliente en fragmentos manejables. Utilizando `mongoose-paginate-v2`, evitamos colapsar la red y la memoria del servidor enviando miles de documentos de golpe.

---
¡Hola a todos! Como continuación de nuestra última sesión, he preparado este material complementario. Aquí encontraremos un resumen de los conceptos teóricos clave y un anexo práctico con código real en Express y Mongoose para que puedan aplicar lo aprendido directamente en sus proyectos.

---

## 1. Resumen de la Clase: Optimizando MongoDB

En esta unidad abordamos cómo escalar y optimizar nuestras bases de datos para manejar entornos de producción reales:

* **Indexación:** La herramienta fundamental para evitar que MongoDB haga un escaneo completo de la colección (Collection Scan). Al aplicar índices a campos específicos, creamos estructuras B-tree que reducen los tiempos de búsqueda de milisegundos a prácticamente cero. Aprendimos sobre índices simples, compuestos, de texto y geoespaciales.
* **Populations:** El equivalente a los "Joins" relacionales, pero adaptado a la filosofía NoSQL. Consiste en guardar la referencia (el `_id`) de un documento en otro y usar el método `.populate()` de Mongoose para "hidratar" o traer la información completa del documento referenciado al momento de la consulta.
* **Aggregations:** El motor de procesamiento de datos de MongoDB. Funciona mediante *pipelines* (tuberías) donde los datos pasan por múltiples etapas (`$match`, `$group`, `$sort`) para ser transformados, filtrados o resumidos, ideal para reportes y analítica.
* **Paginación:** La técnica obligatoria para enviar datos al cliente en fragmentos manejables. Utilizando `mongoose-paginate-v2`, evitamos colapsar la red y la memoria del servidor enviando miles de documentos de golpe.

---

## 2. Anexo Práctico: Implementación en Código

### Indexación en Mongoose

No necesitamos entrar a MongoDB Compass o a la terminal para crear índices; Mongoose nos permite definirlos directamente en el Schema.

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  // 1. Índice simple: Ideal para campos por los que filtramos frecuentemente
  email: { type: String, required: true, unique: true, index: true }, 
  age: Number
});

// 2. Índice compuesto: Optimiza consultas que buscan por nombre Y apellido a la vez
userSchema.index({ first_name: 1, last_name: 1 });

export const userModel = mongoose.model('users', userSchema);

```

> **Regla de oro:** No indexen todos los campos. Cada índice acelera las lecturas, pero ralentiza las escrituras (inserciones/actualizaciones) y consume espacio en disco.

### Automatizando Populations con Middleware

En lugar de escribir `.populate('courses.course')` en cada controlador donde busquemos estudiantes, podemos usar un *middleware pre-hook* de Mongoose para que lo haga automáticamente en cada `find`.

```javascript
const studentSchema = new mongoose.Schema({
  first_name: String,
  courses: [{
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'courses' // El puente hacia la colección de cursos
    }
  }]
});

// Middleware que se ejecuta ANTES de resolver cualquier consulta 'find'
studentSchema.pre('find', function() {
  this.populate('courses.course');
});

export const studentModel = mongoose.model('students', studentSchema);

```

### Aggregation Pipelines en un Controlador Express

Las agregaciones procesan los datos en etapas. El resultado de una etapa es la entrada de la siguiente.

Veamos cómo se vería el caso práctico de la pizzería dentro de una ruta de Express:

```javascript
export const getPizzaReports = async (req, res) => {
  try {
    const reports = await orderModel.aggregate([
      // Stage 1: Filtramos solo las pizzas medianas
      { $match: { size: 'medium' } }, 
      
      // Stage 2: Agrupamos por sabor y sumamos las cantidades
      { $group: { _id: '$flavor', totalQuantity: { $sum: '$quantity' } } }, 
      
      // Stage 3: Ordenamos de mayor a menor venta
      { $sort: { totalQuantity: -1 } }, 
      
      // Stage 4: Guardamos el reporte generado en una nueva colección
      { $merge: { into: 'reports' } } 
    ]);
    
    res.json({ status: 'success', message: 'Reporte generado con éxito' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

```

### Paginación Integrada con Vistas

Al usar `mongoose-paginate-v2`, el modelo nos devuelve un objeto enriquecido con la data de navegación. Así lo enviamos a Handlebars:

```javascript
import mongoosePaginate from 'mongoose-paginate-v2';
// (Asumimos que el plugin ya fue agregado al schema: studentSchema.plugin(mongoosePaginate))

export const renderStudents = async (req, res) => {
  // Tomamos los parámetros de la URL (ej: /students?page=2&limit=5)
  const { page = 1, limit = 10 } = req.query; 
  
  try {
    // lean: true es crucial al usar Handlebars para convertir los documentos de Mongoose a objetos JS puros
    const result = await studentModel.paginate({}, { page, limit, lean: true });
    
    res.render('students', {
      students: result.docs,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page
    });
  } catch (error) {
    res.status(500).send("Error al cargar la paginación");
  }
};

```