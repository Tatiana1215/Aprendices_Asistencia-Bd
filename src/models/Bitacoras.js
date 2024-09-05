const mongoose = require('mongoose')

const bitacoraScheman = new mongoose.Schema({
    Id_Aprendiz: {type: mongoose.Schema.Types.ObjectId, ref:'Aprendiz'},
    Estado: { type: String, enum: ['Asis', 'No Asistio', 'Excusa', 'Pendiente'], default: 'Pendiente' },
},{ timestamps: true })

module.exports = mongoose.model("Bitacora", bitacoraScheman)