const mongoose = require('mongoose')

const bitacoraScheman = new mongoose.Schema({
    Id_Aprendiz: {type: mongoose.Schema.Types.ObjectId, ref:'Aprendiz'},
    // FechaHora: {type: Date , default:Date.now}
},{ timestamps: true })

module.exports = mongoose.model("Bitacora", bitacoraScheman)