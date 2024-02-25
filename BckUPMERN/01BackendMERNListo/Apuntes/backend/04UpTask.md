# Tareas

- Creo el modelo de Tarea
- Tarea.js

~~~js
import mongoose from 'mongoose'


const tareaSchema = mongoose.Schema({

    nombre:{
        type: String,
        trim: true,
        required: true
    },
    descripcion:{
        type: String,
        trim: true,
        required: true
    },
    estado:{
        type: Boolean,
        default: false
    },
    fechaEntrega:{
        type: Date,
        required: true,
        default: Date.now()
    },
    prioridad:{
        type: String,
        required: true,
        enum:['Baja', 'Media', 'Alta']
    },
    proyecto:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Proyecto' //Tal y como se definió en el primer parámetro del modelo despues de definir el schema
    }

},{
    timestamps: true
})



const Tarea = mongoose.model('Tarea', tareaSchema)

export default Tarea
~~~
---

## Routing y controlador de Tarea

- Creo el router, lo añado al index con el endpoint "/api/tareas", creo los controllers.
    - La función obtenerTareas, en plural, está en proyectoController. Se discutrirá más adelnate porque hay varias formas de hacerlo
    - Por ejemplo definir una referencia en el modelo de proyecto y traerlo todo como un arreglo
- tareaRouter.js

~~~js
import express from 'express'
import { obtenerTarea, agregarTarea, actualizarTarea,eliminarTarea, cambiarEstado } from '../controllers/tareaController.js'
import checkAuth from '../middleware/checkAuth.js'


const router = express.Router()

router.route('/:id')
    .get(checkAuth,obtenerTarea)
    .put(checkAuth,actualizarTarea)
    .delete(checkAuth,eliminarTarea)

router.post('/', checkAuth, agregarTarea)
router.post('/estado/:id', checkAuth, cambiarEstado)
~~~
----

## Agregar Tarea

- En el body de la petición paso el id del proyecto al que pertenece la tarea en el campo proyecto
    - No olvidarse de colocar el token del usuario en la pestaá Auth/Bearer de ThunderClient
- Primero tengo que comprobar que el proyecto existe
- Luego que el creador del proyecto sea el mismo que agrega la tarea
- Uso el toString() porque es un ObjectId
- Puedo usar el new Tarea pero también puedo usar el Tarea.create() de mongoose, y pasarle el req.body
- tareaController.js

~~~js
export const agregarTarea = async (req,res)=>{

    const {proyecto} = req.body

    const existeProyecto = await Proyecto.findById(proyecto)

    if(!existeProyecto){
        const error = new Error("No se encontró el proyecto")
        return res.status(404).json({msg: error.message})
    }

    if(existeProyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error("No tienes los permisos para añadir tareas")
        return res.status(400).json({msg: error.message})
    }

    
    try {
        const tareaAlmacenada = await Tarea.create(req.body)
        res.json(tareaAlmacenada)
        
    } catch (error) {
        console.log(error)
    }
}
~~~

## Obtener Tarea

- Para no hacer dos llamados a la db ya que en tare no tengo quien creó la tarea, pero tengo el proyecto al que hace referencia 
    - uso populate para acceder a la información contenida en el id de proyecto
    - Le paso el campo "proyecto" que figura en el modelo de Tarea haciendo referencia a Proyecto, para obtener esa información

        NOTA: 404 = error, 403= no tienes permisos, 401= necesita estar autenticado
~~~js
export const obtenerTarea = async (req,res)=>{

    const {id} = req.params

    const tarea = await Tarea.findById(id).populate("proyecto")

    if(!tarea){
        const error = new Error("No se encuentra la tarea")
        return res.status(404).json({msg: error.message})

    }else if(tarea.proyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error("No tienes los permisos necesarios")
        return res.status(403).json({msg: error.message})
    }

    res.status(200).json(tarea)

}
~~~
----

## Actualizar Tarea

- El proceso para obtener el creador a través del id es el mismo

~~~js
export const actualizarTarea = async(req,res)=>{
    const {id} = req.params

    const tarea = await Tarea.findById(id).populate("proyecto")

    if(!tarea){
        const error = new Error("No se encuentra la tarea")
        return res.status(404).json({msg: error.message})

    }else if(tarea.proyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error("No tienes los permisos necesarios")
        return res.status(403).json({msg: error.message})
    }

    try {
        const tareaActualizada = await Tarea.findByIdAndUpdate(id, req.body, {new: true})

        res.status(200).json(tareaActualizada)
        
    } catch (error) {
        console.log(error)
    }
    
}
~~~

## Eliminar Tarea

- El proceso para obtener el creador y hacer las verificaciones es el mismo. **REFACTORIZAR**

~~~js
export const eliminarTarea = async(req,res)=>{
    const {id} = req.params

    const tarea = await Tarea.findById(id).populate("proyecto")

    if(!tarea){
        const error = new Error("No se encuentra la tarea")
        return res.status(404).json({msg: error.message})

    }else if(tarea.proyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error("No tienes los permisos necesarios")
        return res.status(403).json({msg: error.message})
    }

    try {
        await Tarea.findByIdAndDelete(id)
        res.status(200).json({msg: "Tarea eliminada correctamente"})
    } catch (error) {
        
    }    
}
~~~
----

## Cambiar Estado

~~~js
export const cambiarEstado = async(req,res)=>{

    const {id} = req.params

    const tarea = await Tarea.findById(id).populate("proyecto")

    if(!tarea){
        const error = new Error("No se encuentra la tarea")
        return res.status(404).json({msg: error.message})

    }else if(tarea.proyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error("No tienes los permisos necesarios")
        return res.status(403).json({msg: error.message})
    }

    tarea.estado = true

    try {
        await tarea.save()

        res.status(200).json({msg: "Estado cambiado correctamente"})
        
    } catch (error) {
        console.log(error)
    }
}
~~~
----

## Obtener Tareas

- Me muevo a obtenerProyecto en el proyectoController.js para agregarle un campo con las tareas asociadas
- Le agrego tareas

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

    const tareas = await Tarea.find().where("proyecto").equals(proyecto._id)

    

    res.json({
        proyecto,
        tareas
    })

}
~~~

- proyecto es inmutable, pero puedo tomar una copia de proyecto y tareas con el parámetro rest
- El problema es que devuelve mucha info basura de mongo

~~~js
const respuesta= {...proyecto, ...tareas}
~~~

- La manera elegida sería devolver un objeto json con proyecto y tareas

~~~js
res.json({
    proyecto,
    tareas
})
~~~

- De esta manera las tareas asociadas vienen con obtenerProyecto, no necesito obtenerTareas
- El apartado de colaboradores va a ser un arreglo que va a almacenar el id de cada colaborador
- En proyecto también podría tener un arreglo de tareas, pero para ello tendríamos que agregar a las funciones del tareaController el ir almacenando el id para que el populate funcione

- Ahora le toca al FRONTEND, habrá arreglos en el backend a medida que avance el FRONTEND




