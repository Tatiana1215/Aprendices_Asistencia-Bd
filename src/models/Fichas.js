const mongoose = require('mongoose')
const fichaSchema = new mongoose.Schema({
    Codigo: {type:String, require:true, unique:true,},
    Nombre:{type:String, require:true, max:50},
    Estado: {type:Number, require, default:1}
})

module.exports = mongoose.model("Ficha", fichaSchema )