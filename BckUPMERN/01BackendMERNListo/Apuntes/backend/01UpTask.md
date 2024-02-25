# UpTask

- Creo la carpeta backend y frontend (React con Vite)
- Creo en la carpeta backend el package.json con npm init -y
- Instalo express
- Creo index.js:

~~~js
import express from 'express'

const app = express()

const PORT = 4000 || process.env.PORT

app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en puerto ${PORT}`)
})
~~~

- Creo el script con nodemon para rodar el index
- Agrego type: module para usar los imports de js

~~~json
"type": "module",
"scripts":{
    "dev": "nodemon index.js"
}
~~~

> npm run dev

----

# Conectando a la db

- Instalo mongoose
- Creo la carpeta config con el archivo db.js

~~~js
import mongoose from "mongoose"


const conectarDB= async()=>{
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI, {
                                        useNewUrlParser: true,
                                        useUnifiedTopology: true
        })
        const url =`${connection.connection.host}: ${connection.connection.port}`

        console.log(`MongoDB conectado en ${url}`)

    } catch (error) {
        console.log(`error: ${error.message}`)
        process.exit(1) //para forzar que el proceso termine
    }
}

export default conectarDB
~~~

- Install dotenv
- Debo importar e iniciar dotenv en el index.js

~~~js
import dotenv from 'dotenv'

const app = express()

dotenv.config()
~~~

- En el .env coloco el string de conexión

> MONGO_URI=mongodb://localhost:27017/UpTask3

- Integro el archivo en el index.js, lo importo. (Los archivos creados por mi acaban en .js)

~~~js
import express from 'express'
import dotenv from 'dotenv'
import conectarDB from './config/db.js'

const app = express()

dotenv.config()

const PORT = 4000 || process.env.PORT

conectarDB()

app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en puerto ${PORT}`)
})
~~~
-----


