# MVC

- Creo la carpeta models en /backend con el archivo Usuario.js
- Usuario.js:

~~~js
import mongoose from 'mongoose'

const usuarioSchema = mongoose.Schema({
    nombre:{
        type: String,
        required: true,
        trim: true
    },
    password:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    token:{
        type: String,
        
    },
    confirmado:{
        type: Boolean,
        default: false
    }
},{
    timestamps: true //para agregar la fecha de creación

})

const Usuario = mongoose.model("Usuario",usuarioSchema ) //le paso el nombre y el schema al modelo

export default Usuario
~~~

# Routing de Usuarios

- Para realizar un CRUD COMPLETO
- Las rutas para proyectos, usuarios y tareas van a estar separadas y vana tener asociadas diferentes controladores
- Creo la carpeta routes con el usuarioRouter.js:

~~~js
import express from 'express'

const router = express.Router()

router.get('/', (req,res)=>{
    res.json("Desde API/USUARIOS")
})

export default router
~~~

- Lo importo en index y le establezco la ruta /api/usuarios al router. Hago uso del app.use
- Como es una exportación por defecto puedo ponerle el nombre al router que yo quiera
- index.js:

~~~js
import express from 'express'
import dotenv from 'dotenv'
import conectarDB from './config/db.js'
import usuarioRoutes from './routes/usuarioRouter.js'

const app = express()

dotenv.config() //habilita usar las variables de entorno

const PORT = 4000 || process.env.PORT
conectarDB()

//Routing
app.use("/api/usuarios", usuarioRoutes) 


app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en puerto ${PORT}`)
})
~~~

- Ahora debo escribir esto en la barra de navegacion para tener la respuesta GET:

> localhost:4000/api/usuarios
------

# Controladores

- En lugar del callback de req,res en el router, puedo encapsular la función en un controlador
- Creo la carpeta /controllers en /backend con el archivo usuarioController.js
- Aqui defino la función. En el router le añado el tipo de método (GET, POST, PUT, DELETE)
- usuarioController.js:

~~~js
export const usuarios = (req,res)=>{
    res.json("GET desde API/USUARIOS")
}

export const crearUsuario= (req,res)=>{
    res.json({msg: "Creando usuario"})
}
~~~

- Se lo añado al router
- usuarioRouter.js:

~~~js
import express from 'express'
import { usuarios } from '../controllers/usuarioController.js'

const router = express.Router()

router.get('/', usuarios)
router.post('/', crearUsuario)


export default router
~~~

        NOTA: ESTO ERA CON FINES DIDÁCTICOS. BORRO LOS DOS MËTODOS Y LAS FUNCIONES DEL CONTROLADOR PARA IR AL PROYECTO


- usuarioRouter.js:

~~~js
import express from 'express'
import {registrarUsuario, actualizarUsuario, borrarUsuario  } from '../controllers/usuarioController.js'

const router = express.Router()

//Autenticación, Registro y Confirmación de Usuarios

router.post('/', registrarUsuario) 
router.put('/:id', actualizarUsuario)
router.delete('/:id', borrarUsuario)


export default router
~~~

- usuarioController.js:

~~~js
export const registrarUsuario= (req,res)=>{

}

export const actualizarUsuario= (req,res)=>{

}

export const borrarUsuario= (req,res)=>{

    
}
~~~
----

## Enviando Request, Leyendo Datos y creando Usuario

- Hay que enviar en el request los campos que se definieron en el modelo: nombre, password y email
- Uso en ThunderClient raw/json para enviarle los datos

~~~json
{
  "nombre": "Juan",
  "password": "123456",
  "email": "jaun@mail.com"
}
~~~

- Hay que habilitar en el index.js para que pueda leer y procesar los json del req.body

> pp.use(express.json())

- Ahora ya podría extraer la data del req.body en el controlador

~~~js
export const registrarUsuario= (req,res)=>{
    const {nombre, email, password}= req.body

    res.json({nombre, email, password})
}
~~~

- Lo que quiero es insertar la data en la DB
- Importo el modelo y creo una nueva instancia de Usuario pasándole el req.body
- Como va a interactuar con la DB uso async await. Para salvar el usuario, usuario.save()
- usuarioController.js:

~~~js
import Usuario from "../models/Usuario.js"


export const registrarUsuario= async (req,res)=>{
    try {
        
        const usuario = new Usuario(req.body)
        const usuarioAlmacenado= await usuario.save()
        res.json({msg: "Usuario creado"})

    } catch (error) {
        console.log(error)
    }
}
~~~

- Usuario creado!
- El password no está hasheado y no generó el token.
- Si vuelvo a registrar el mismo correo se bloquea la app. Hay que mostrar el mensaje de usuario ya registrado
----

## Previniendo usuarios duplicados

- Extraigo el mail con desestructuración, hago la busqueda con findOne, creo la sentencia condicional lanzando el error
- usuarioController.js:

~~~js
export const registrarUsuario= async (req,res)=>{
    
    const {email} = req.body
    const usuarioRegistrado = await Usuario.findOne({email})
   
    if(usuarioRegistrado) {
        const error = new Error("El usuario ya existe")
        return res.status(400).json({msg: error.message})
    }
    
    try {
        
        const usuario = new Usuario(req.body)
        const usuarioAlmacenado= await usuario.save()
        res.json({msg: "Usuario creado"})

    } catch (error) {
        console.log(error)
    }
}
~~~
----

# Hashear Passwords

- Instalo bcryptjs
- Lo importo en el modelo de Usuario, hago uso del middleware Pre (antes de que se almacene)
- Cómo voy a hacer uso del this no uso una arrow function
- Uso el await en el salt para bloquear el código hasta que esté listo el salt, ya que lo necesito en la siguiente linea
- isModified es una función de Mongoose. Si no está modificando el password, next (pasa a lo siguiente y no ejecutes el código que sigue)
- /models/Usuario.js:

~~~js
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const usuarioSchema = mongoose.Schema({
    nombre:{
        type: String,
        required: true,
        trim: true
    },
    password:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    token:{
        type: String,
        
    },
    confirmado:{
        type: Boolean,
        default: false
    }
},{
    timestamps: true //para agregar la fecha de creación

})

//hasheo de password

usuarioSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next()
    }   
    
    const salt = await bcrypt.genSalt(10) // 10 es el número de rondas aceptable de dificultad para descifrar
    this.password= await bcrypt.hash(this.password, salt) // le paso la cadena sin hashear y el salt
    
})

const Usuario = mongoose.model("Usuario",usuarioSchema ) //le paso el nombre y el schema al modelo

export default Usuario
~~~

# Generar un ID para token único

- Creo la carpeta /helpers con generarID.js
- En la función, parseo a string Math.random() y le quito los 2 primeros caracteres para quitarle el 0. del principio
- Le sumo el Date.now() en el return
- /helper/generarId.js:

~~~js
export const generarID =()=>{

    const random = Math.random().toString(32).substring(2)
    const fecha = Date.now().toString(32) 

    return random + fecha
}
~~~

- Guardo el id en usuario.token
- usuarioController.js:

~~~js
export const registrarUsuario= async (req,res)=>{
    
    const {email} = req.body
    const usuarioRegistrado = await Usuario.findOne({email})
   
    if(usuarioRegistrado) {
        const error = new Error("El usuario ya existe")
        return res.status(400).json({msg: error.message})
    }
    try {
        
        const usuario = new Usuario(req.body)
        usuario.token = generarId()  //token ID
        const usuarioAlmacenado= await usuario.save()
        return res.json({msg: "Usuario creado"})

    } catch (error) {
        console.log(error)
    }
}
~~~

- Este token lo voy a enviar via email, buscamos el usuario con ese token y confirmo la cuenta

# Creando el endpoint de autenticación

- Creo la ruta de login
- usuarioRouter.js:

~~~js
import express from 'express'
import {registrarUsuario, actualizarUsuario, borrarUsuario  } from '../controllers/usuarioController.js'

const router = express.Router()

//Autenticación, Registro y Confirmación de Usuarios

router.post('/', registrarUsuario) 
router.post('/login', autenticarUsuario)


export default router
~~~

- Creo el controlador autenticarUsuario
    - Comprobar si el usuario existe
    - Comprobar si está confirmado
    - Comprobar el password
- usuarioController.js:

~~~js
export const autenticarUsuario = async (req,res)=>{

    const {email, password} = req.body
    const usuario = await Usuario.findOne({email})

    if(!usuario){
        const error = new Error("El usuario no existe")
        return res.status(404).json({msg: error.message})
    }

    if(!usuario.confirmado){
        const error = new Error("La cuenta no está confirmado")
       return  res.status(403).json({msg: error.message})
    }   
}
~~~

# Comprobar el password

- Creo la función en el modelo de Usuario.js con .methods

~~~js
usuarioSchema.methods.comprobarPassword = async function(passwordFormulario){
    return await bcrypt.compare(passwordFormulario, this.password) //retorna true o false
}
~~~

- Llamo al método en el controlador. Lo meto en un if con un await
- Contruyo un objeto para retornar nombre, email y id del usuario.
- Se recomienda almacenar aqui un JSON-WEB-TOKEN
- usuarioController.js:

~~~js
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
            email: usuario.email
        })
    }else{
        res.json({msg: "Password incorrecto!"})
    }
}
~~~

- Cambio en la base de datos confirmado a true para poder hacer la prueba de autenticación
------

# JWT

- Instalo jsonwebtoken
- Creo otro helper y lo llamo generarJWT.js
- Guardo la palabra secreta para firmar el jsonwebtoken en una variable de entorno
- Le paso el id para guardarlo en el token
- generarJWT.js:

~~~js
import jwt from 'jsonwebtoken'

const generarJWT = (id)=>{

    return jwt.sign({id}, process.env.JWT_SECRET,{
        expiresIn: '30d'
    })
}

export default generarJWT
~~~

- La coloco en el controlador
- usuarioController.js:

~~~js

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
~~~
-----

## Endpoint para confirmar cuentas

- Añado la ruta tipo GET con : para el routing dinámico
- usuarioRouter.js:

~~~js
import express from 'express'
import {registrarUsuario, autenticarUsuario, confirmarUsuario } from '../controllers/usuarioController.js'

const router = express.Router()

//Autenticación, Registro y Confirmación de Usuarios

router.post('/', registrarUsuario) 
router.post('/login', autenticarUsuario)
router.get('/confirmar/:token', confirmarUsuario)


export default router
~~~

- Busco el usuario con findOne a través del token que contiene el _id
- Uso un try y un catch para debuguear en caso de error. Seteo confirmado a true y el token, al ser de un solo uso, lo seteo a string vacío
- usuarioController.js:

~~~js
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
~~~

- He cambiado manualmente a true el usuario confirmado para poder hacer el login. Devuelvo en un json el JWT en autenticarUsuario, en la función de comprobarPassword, que servirá para confirmar la cuenta con un mail y el jwt.
- Puedo comprobar en la página de JWT que dentro está el id
- Para confirmar el token USO EL TOKEN ALMACENADO en la DB en MONGO COMPASS. NO ES EL JWT TODAVÍA, es el que yo generé con el helper generarId
- SI ALGUIEN OLVIDA EL PASSWORD NO HAY FORMA DE REVERTIR LA CADENA HASHEADA
    - Se le enviará un mail con un token para escribir el nuevo password

## Funcionalidad resetear passwords

- Creo una ruta nueva tipo POST. Va a ser de tipo POST pq el usuario va a enviar su email y se comprobará que exista, que esté confirmado
    - En caso de que esté todo bien se le envia un token para reestablecer el password
- usuarioRouter.js:

~~~js
import express from 'express'
import {registrarUsuario, autenticarUsuario, confirmarUsuario, olvidePassword } from '../controllers/usuarioController.js'

const router = express.Router()

//Autenticación, Registro y Confirmación de Usuarios

router.post('/', registrarUsuario) 
router.post('/login', autenticarUsuario)
router.get('/confirmar/:token', confirmarUsuario)
router.post('/olvide-password', olvidePassword)


export default router
~~~

- Defino la función en el controller
- Se le requerirá con un input que introduzca su email
    - compruebo que existe el mail en la db
    - genero un token con generarId. Se enviará un jwt por email, deberá clicar en el enlace
    - Hay que guardarlo en la db
- usuarioController.js:

~~~js
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
~~~

- Ahora genero otra ruta GET con /olvide-password/:token que le permitirá definir al usuario un nuevo password
- Hay que identificar que sea un token válido e identificar el usuario
- usuarioRouter.js:

~~~js
router.get('/olvide-password/:token', comprobarToken)
~~~

- usuarioController.js:

~~~js
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
~~~

- En caso de que sea correcto el token voy a renderizar un formulario para introducir el nuevo password.
----

## Almacenando el nuevo password

- Creo la nueva ruta tipo POST para el nuevo password. Como apunta al mismo endpoint pero con metodo diferente puedo usar .route
- usuarioRouter.js:

~~~js
import express from 'express'
import {registrarUsuario, autenticarUsuario, confirmarUsuario, olvidePassword, comprobarToken, nuevoPassword } from '../controllers/usuarioController.js'

const router = express.Router()

//Autenticación, Registro y Confirmación de Usuarios

router.post('/', registrarUsuario) 
router.post('/login', autenticarUsuario)
router.get('/confirmar/:token', confirmarUsuario)
router.post('/olvide-password', olvidePassword)

router.route('/olvide-password/:token')
        .get(comprobarToken)
        .post(nuevoPassword)

export default router
~~~

- Hago una nueva petición POST al endpoint desde ThunderClient. Añado en el body el nuevo password

~~~json
{
  "password": "nuevopassword"
}
~~~
- En usuarioController creo la función nuevoPassword, extraigo el token de params y el password de body
    - verifico que el usuario existe
    - Si existe cambio el password, seteo el token a string vacío y guardo en un try catch. Si no lanzo error
- usuarioController.js:

~~~js
export const nuevoPassword =async(req,res)=>{

    const {token} = req.params
    const {password} = req.body

    const usuario = await Usuario.findOne({token})

    if(usuario){
        usuario.password = password
        usuario.token= ""

        try {
            await usuario.save()

            return res.json({msg: "Password modificado correctamente"})
            
        } catch (error) {
            console.log(error)
        }
       
    }else{
        const error = new Error("Token no válido")
        return res.status(403).json({msg: error.message})
    }
}
~~~
---

# Custom Middleware para autenticación

- Hay rutas en las que el usuario necesita estar autenticado para acceder
- Creo la carpeta middleware/checkAuth.js
- Creo la ruta /perfil, luego coloco el middleware de autenticación, y luego el controlador (lo defino en el controller con un console.log)
- usuarioRouter.js:

~~~js
router.get('/perfil', checkAuth, perfil)
~~~

- Este middleware servirá para proteger este endpoint. Debo comprobar que el jsonwebtoken sea válido, que el usuario sea correcto, que no haya expirado, etc
- En req.headers.authorization es donde se envia el jsonwebtoken
- Para hacer la petición con ThunderClient hay que introducir el jsonwebtoken  en la pestaña Authorization/Bearer Token
- Si hago un console.log del token veré que primero dice Bearer (espacio) y luego el token. Yo necesito solo el token. 
    - Uso .split con un espacio en blanco para dividir la cadena en dos, me interesa la posición 1
- Decodifico el token con la librería
- Creo en el req la variable usuario. En ella guardo el usuario que he buscado en la db con el id decodificado del jsonwebtoken
    - id va sin guión bajo porque es el que extraigo del jsonwebtoken
    - De esta manera tengo disponible el usuario siempre que aplique el middleware y el jsonwebtoken sea correcto
    - Si lo hago en crudo devuelve todo el usuario, password incluido
        - Para ello uso el .select con -password, para que no lo retorne
- checkAuth.js:

~~~js
import jwt from 'jsonwebtoken'
import Usuario from '../models/Usuario.js'

const checkAuth = async(req,res,next)=>{
    
    let token=""

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        
        try {
            token = req.headers.authorization.split(' ')[1]

            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            req.usuario = await Usuario.findById(decoded.id).select("-password -confirmado -token -createdAt -updatedAt -__v")

            return next()

        } catch (error) {
            return res.status(404).json({msg:"Hubo un error"})
        }
    }

    if(!token){
        const error= new Error("Token no válido")
        return res.status(401).json({msg: error.message})
    }
    
    next()
}

export default checkAuth
~~~

- Tengo un console.log("desde perfil") en el controlador perfil. Si la autenticación ha ido bien con el jsonwebtoken, debe aparecer por consola
- Ahora puedo extraer el usuario desde el controlador

~~~js
export const perfil = async (req,res)=>{
    const {usuario} = req
    
    res.json({usuario})
}
~~~

- Con este middleware prevengo el acceso a la ruta hasta que el usuario esté autenticado
- Entonces, tengo el método comprobarPassword declarado en el modelo de Usuario que uso en el controlador autenticarUsuario
    - Devuelve true o false. Si devuelve true genero el jwt y le paso el _id para que lo codifique ( nunca pasar info sensible )
    - En checkAuth verifico que en los headers hay el Bearer Token, hago el .split() y separo por el espacio para quedarme solo con el jwt
    - Decodifico el id que coloqué en el jwt con .verify y la palabra secreta
    - Hago la busqueda del usuario con el id decodificado y la guardo en req.usuario
    - Uso el next() para que pase al siguiente
    - De esta manera obtengo el usuario del middleware y protejo las rutas

-----
















