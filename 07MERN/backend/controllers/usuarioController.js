import Usuario from "../models/Usuario.js"
import { generarId } from "../helpers/generarId.js"
import generarJWT from "../helpers/generarJWT.js"

export const registrarUsuario= async (req,res)=>{
    
    const {email} = req.body
    const usuarioRegistrado = await Usuario.findOne({email})
   
    if(usuarioRegistrado) {
        const error = new Error("El usuario ya existe")
        return res.status(400).json({msg: error.message})
    }
    

    try {
        
        const usuario = new Usuario(req.body)
        usuario.token = generarId()
        const usuarioAlmacenado= await usuario.save()
        res.json({msg: "Usuario creado"})

    } catch (error) {
        console.log(error)
    }
}

export const autenticarUsuario = async (req,res)=>{

    const {email, password} = req.body
    const usuario = await Usuario.findOne({email})

    if(!usuario){
        const error = new Error("El usuario no existe")
        return res.status(404).json({msg: error.message})
        
    }
    if(!usuario.confirmado){
        const error = new Error("La cuenta no está confirmado")
        return res.status(403).json({msg: error.message})
    }   

    if(await usuario.comprobarPassword(password)){
             res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario._id)
        })
    }else{
        const error = new Error("Password Incorrecto")
        return res.status(403).json({msg: error.message})
    }
}

export const confirmarUsuario= async (req,res)=>{
    const {token} = req.params

    const usuarioConfirmar= await Usuario.findOne({token})

    if(!usuarioConfirmar){
        const error = new Error("Token no válido")

       return res.status(400).json({msg: error.message})
    }

    try {
        usuarioConfirmar.confirmado = true
        usuarioConfirmar.token = ''
        await usuarioConfirmar.save()

        res.json({msg: "Usuario confirmado correctamente!"})
        
    } catch (error) {
        console.log(error)
    }

}

export const olvidePassword = async (req,res)=>{
    const {email} = req.body

    const usuario = await Usuario.findOne({email})

    if(!usuario){
        const error = new Error("El usuario no existe")
        return res.status(404).json({msg: error.message})
    }

    try {
        usuario.token = generarId()
        await usuario.save()
        res.json({msg: "Hemos enviado un email con las instrucciones"})

    } catch (error) {
        console.log(error)
    }


}

export const comprobarToken= async(req,res)=>{

    const {token} = req.params

    const tokenValido = Usuario.findOne({token})

    if(tokenValido){
        res.json({msg: "Token válido"})
    }else{
        const error = new Error("Token no válido")
        return res.status(403).json({msg: error.message})
    }
}

export const nuevoPassword =async(req,res)=>{

    const {token} = req.params
    const {password} = req.body

    const usuario = await Usuario.findOne({token})

    if(usuario){
        usuario.password = password
        usuario.token= ""

        try {
            await usuario.save()

            res.json({msg: "Password modificado correctamente"})
            
        } catch (error) {
            console.log(error)
        }
       
    }else{
        const error = new Error("Token no válido")
        return res.status(403).json({msg: error.message})
    }
}


export const perfil = async (req,res)=>{
    const {usuario} = req
    
    res.json({usuario})
}