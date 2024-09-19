// const mongoose = require('mongoose')
import mongoose from 'mongoose'

const aprendicesSchema = new mongoose.Schema({
    // Documento: { type: String, require: true, unique: true, min: 10 },
    // Nombre: { type: String, require: true, max: 20 },
    // Telefono: { type: String, require: true, unique: true, min: 10 },
    // Email: { type: String, require: true, unique: true },
    // Estado: { type: Number, require: true, default: 1 },
    // Firma: { type: String, // Aquí almacenamos la ruta del archivo de la firma
    //          required: false // Este campo es opcional
    // },
    // Id_Ficha: { type: mongoose.Schema.Types.ObjectId, ref: 'Ficha' }
    Documento: { type: String },
    Nombre: { type: String,  },
    Telefono: { type: String,  },
    Email: { type: String, },
    Estado: { type: Number, },
    Firma: { type: String, // Aquí almacenamos la ruta del archivo de la firma
            // Este campo es opcional
    },
    Id_Ficha: { type: mongoose.Schema.Types.ObjectId, ref: 'Ficha' }
})
export default mongoose.model("Aprendiz", aprendicesSchema)
// ElementInternals,telefono
