const mongoose = require('mongoose')

const aprendicesSchema = new mongoose.Schema({
    Documento:{ type:String, require:true, unique:true, min:10},
    Nombre:{type:String, require:true},
    Telefono:{type:String, require, unique:true, min:10},
    Email:{type:String, require, unique:true},
    Estado:{type:Number, require:true, default:1},
    Id_Ficha: {type:mongoose.Schema.Types.ObjectId,ref:'Ficha'}
})

module.exports = mongoose.model("Aprendiz",aprendicesSchema)
// ElementInternals,telefono
