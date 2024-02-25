# Proyectos

- Creo el archivo /models/Proyecto.js
- Proyecto.js:

~~~js
import mongoose from 'mongoose'

const proyectoSchema = mongoose.Schema({

    nombre:{
        type: String,
        trim : true,
        required: true
    },

    descripcion: {
        type: String,
        trim : true,
        required: true
    },

    fechaEntrega:{
        type: Date,
        default: Date.now()
    },

    cliente:{
        type: String,
        trim : true,
        required: true
    },

    creador:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario", //el valor primero que se coloco en el modelo con el schema
    },

    colaboradores: [  //pongo un arreglo porque puede tener más de uno
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Usuario"
        },
    ] 
    //Faltan las tareas, más adelante
},{
    timestamps: true
})

const Proyecto = mongoose.model("Proyecto", proyectoSchema)

export default Proyecto
~~~
----

## Creando el routing y funciones de Proyecto

- Creo /controllers/proyectoController.js y /routes/proyectoRouter.js
- proyectoController.js:

~~~js


export const obtenerProyectos = (req,res) =>{

}

export const nuevoProyecto = (req,res) =>{

}

export const obtenerProyecto = (req,res) =>{

}

export const editarProyecto = (req,res) =>{

}

export const eliminarProyecto = (req,res) =>{

}

export const agregarColaborador = (req,res) =>{

}

export const eliminarColaborador = (req,res) =>{

}

export const obtenerTareas = (req,res) =>{

}
~~~

- Creo el router, importo los controladores, en el index hago uso del router con .use y la url "/api/proyectos"
- index.js:

~~~js
app.use("/api/proyectos", proyectoRoutes )
~~~

- Eliminar colaborador es .post porque delete es para borrar un recurso completo, no cierta parte de un recurso
- proyectoRouter.js:

~~~js
import express from 'express'
import { obtenerProyectos, nuevoProyecto, 
        obtenerProyecto, editarProyecto, eliminarProyecto, 
        agregarColaborador, eliminarColaborador,obtenerTareas } from '../controllers/proyectoController.js'
import checkAuth from '../middleware/checkAuth.js'


const router = express.Router()

router.route('/')
    .get(checkAuth, obtenerProyectos)
    .post(checkAuth, nuevoProyecto)

router.route('/:id')
    .get(checkAuth, obtenerProyecto)
    .put(checkAuth, editarProyecto)
    .delete(checkAuth, eliminarProyecto)

router.get('/tareas/:id', checkAuth, obtenerTareas)
router.post('/agregar-colaborador/:id', checkAuth, agregarColaborador)
router.post('/eliminar-colaborador/:id', checkAuth, eliminarColaborador)

export default router
~~~
---

# Creando Proyectos

- Creo la petición POST de nuevoProyecto
- ThunderClient:

~~~json
{
  "nombre": "Tienda Virtual",
  "descripcion": "Tienda para un cliente extranjero",
  "cliente": "Jefferson Pattern"
}
~~~

- Debo añadir el token en Auth/Bearer
- Coloco un console.log(req.body) a nuevoProyecto para que me muestre en pantalla si me devuelve la info
- Como en el checkAuth añadí el req.usuario, ahora tengo la info del usuario autenticado
- Importo el modelo de Proyecto

~~~js
export const nuevoProyecto = async (req,res) =>{
    const proyecto = new Proyecto(req.body)
    proyecto.creador= req.usuario._id

    try {
        const proyectoAlmacenado = await proyecto.save()
        res.json({proyectoAlmacenado})
        
    } catch (error) {
        console.log(error)       
    }   
}
~~~

- Ahora si hago la petición POST desde ThunderClient me crea el nuevo proyecto

~~~json
{
  "proyectoAlmacenado": {
    "nombre": "Tienda Virtual",
    "descripcion": "Tienda para un cliente extranjero",
    "fechaEntrega": "2023-02-23T12:38:37.467Z",
    "cliente": "Jefferson Pattern",
    "colaboradores": [],
    "_id": "63f75e64a142a793c99eec43",
    "creador": "63f627296c6b12ae8d11cecc",
    "createdAt": "2023-02-23T12:39:00.905Z",
    "updatedAt": "2023-02-23T12:39:00.905Z",
    "__v": 0
  }
}
~~~

- Tengo dos proyectos con Marc y uno con Pedro
---

# Obtener Proyectos

- Se tienen que listar los proyectos de la persona que ha iniciado sesión
- uso el req.usuario que viene gracias al checkAuth para obtener el id del usuario

~~~js
export const obtenerProyectos = async (req,res) =>{
    const proyectos = await Proyecto.find().where("creador").equals(req.usuario)

    res.json(proyectos)   
}
~~~

---

# Obtener Proyecto

- Usa el id en la url
- Yo solo puedo ver los proyectos que yo he creado
- Para que proyecto.creador y req.usuario._id hagan match tengo que parsearlos a String los dos

~~~js
export const obtenerProyecto = async (req,res) =>{

    const {id} = req.params

    const proyecto = await Proyecto.findById(id)

    
    if(!proyecto){
        const error = new Error("No encontrado")
        return res.status(404).json({msg: error.message})
    }

    if(proyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error("Acción no válida")
        return res.status(401).json({msg: error.message}) // si coloco un id de un proyecto que yo no hice me devuelve este msg
    }

    res.json(proyecto) // en caso de que 
}
~~~
---

# Actualizar Proyecto

- Debo buscar el proyecto, asegurarme de que exista y solo la persona que lo creó puede actualizarlo
    - Es todo el mismo código de obtenerProyecto
- Ahora usa lo que haya en el body o lo que ya hay en la db

~~~js
export const editarProyecto = async (req,res) =>{
    const {id} = req.params

    const proyecto = await Proyecto.findById(id)

    
    if(!proyecto){
        const error = new Error("No encontrado")
        return res.status(404).json({msg: error.message})
    }

    if(proyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error("Acción no válida")
        return res.status(401).json({msg: error.message}) // si coloco un id de un proyecto que yo no hice me devuelve este msg
    }

    //este código no es necesario con findByIdAndUpdate de mongoose
    proyecto.nombre = req.body.nombre || proyecto.nombre
    proyecto.descripcion = req.body.descripcion || proyecto.descripcion
    proyecto.fechaEntrega = req.body.fechaEntrega || proyecto.fechaEntrega
    proyecto.cliente = req.body.cliente || proyecto.cliente

    try {
        const proyectoActualizado = await proyecto.save()
        res.json(proyectoActualizado)
    } catch (error) {
        console.log(error)
    }
}
~~~

- También se puede hacer con findByIdAndUpdate
- el new: true es para que devuelva el objeto actualizado

~~~js
const proyectoActualizado = await Proyecto.findByIdAndUpdate(id, req.body, {new:true})
~~~
---

# Eliminar Proyecto

- Como refactorización se podría encapsular todo este código repetido en una función

~~~js
export const eliminarProyecto = async (req,res) =>{
    const {id} = req.params

    const proyecto = await Proyecto.findById(id)

    
    if(!proyecto){
        const error = new Error("No encontrado")
        return res.status(404).json({msg: error.message})
    }

    if(proyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error("Acción no válida")
        return res.status(401).json({msg: error.message}) // si coloco un id de un proyecto que yo no hice me devuelve este msg
    }

    try {
        await proyecto.deleteOne()
        res.status(200).json({msg: "Proyecto eliminado"})
    } catch (error) {
        console.log(error)
    }

}
~~~
- Las funciones de colaborador que faltan se verán más adelante con React, y tareas aún no se ha visto




