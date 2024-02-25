import Proyecto from '../models/Proyecto.js'
import Tarea from '../models/Tarea.js'

export const obtenerProyectos = async (req,res) =>{
    const proyectos = await Proyecto.find().where("creador").equals(req.usuario)

    res.json(proyectos)   
}

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
    /*
    proyecto.nombre = req.body.nombre || proyecto.nombre
    proyecto.descripcion = req.body.descripcion || proyecto.descripcion
    proyecto.fechaEntrega = req.body.fechaEntrega || proyecto.fechaEntrega
    proyecto.cliente = req.body.cliente || proyecto.cliente
    */
    try {
        const proyectoActualizado = await Proyecto.findByIdAndUpdate(id, req.body, {new:true})
        res.json(proyectoActualizado)

    } catch (error) {
        console.log(error)
    }
}

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

export const agregarColaborador = (req,res) =>{

}

export const eliminarColaborador = (req,res) =>{

}

