import Tarea from '../models/Tarea.js'
import Proyecto from '../models/Proyecto.js'


export const agregarTarea = async (req,res)=>{

    const {proyecto} = req.body

    const existeProyecto = await Proyecto.findById(proyecto)

    if(!existeProyecto){
        const error = new Error("No se encontró el proyecto")
        return res.status(404).json({msg: error.message})
    }

    if(existeProyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error("No tienes los permisos para añadir tareas")
        return res.status(403).json({msg: error.message})
    }

    
    try {
        const tareaAlmacenada = await Tarea.create(req.body)
        res.json(tareaAlmacenada)
        
    } catch (error) {
        console.log(error)
    }
}

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


