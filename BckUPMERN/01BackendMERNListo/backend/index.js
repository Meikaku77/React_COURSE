import express from 'express'
import dotenv from 'dotenv'
import conectarDB from './config/db.js'
import usuarioRoutes from './routes/usuarioRouter.js'
import proyectoRoutes from './routes/proyectoRouter.js'
import tareaRoutes from './routes/tareaRouter.js'

const app = express()

app.use(express.json())

dotenv.config()


const PORT = 4000 || process.env.PORT
conectarDB()

//Routing

app.use("/api/usuarios", usuarioRoutes)
app.use("/api/proyectos", proyectoRoutes )
app.use("/api/tareas", tareaRoutes)


app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en puerto ${PORT}`)
})