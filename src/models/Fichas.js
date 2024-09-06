// const mongoose = require('mongoose')
import mongoose from "mongoose"
const fichaSchema = new mongoose.Schema({
    Codigo: {type:String, require:true, unique:true,},
    Nombre:{type:String, require:true, max:50},
    Estado: {type:Number, require:true, default:1}
})

export default  mongoose.model("Ficha", fichaSchema )