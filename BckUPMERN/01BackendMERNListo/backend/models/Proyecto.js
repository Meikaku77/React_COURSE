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