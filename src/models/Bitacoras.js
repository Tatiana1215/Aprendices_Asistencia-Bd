// const mongoose = require('mongoose')
import mongoose from "mongoose"

const bitacoraScheman = new mongoose.Schema({
    Id_Ficha: { type: mongoose.Schema.Types.ObjectId, ref: 'Ficha' },
    Id_Aprendiz: {type: mongoose.Schema.Types.ObjectId, ref:'Aprendiz'},
    Estado: { type: String, enum: ['Asistio', 'No Asistio', 'Excusa', 'Pendiente'], default: 'Pendiente' },
    ultimoIngreso: { type: Date, default: null }
},{ timestamps: true })

export default mongoose.model("Bitacora", bitacoraScheman)