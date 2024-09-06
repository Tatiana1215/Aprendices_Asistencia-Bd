// const mongoose = require('mongoose')
import mongoose from "mongoose"

const usuarioSheman = new mongoose.Schema({
    Email: {type:String, require:true, unique:true },
    Password: {type:String, require:true , unique:true,default: "", min:10, max:15},
    Nombre: { type:String , require:true, max:30},
    Estado: {type:Number, require:true , default:1}, 
    // resetPasswordToken: { type: String },  // Token de recuperación de contraseña
    resetPasswordExpires: { type: Date },  // Fecha de expiración del token
    resetPasswordCodigo : {type: String } // Guarda el codigo de verificación
})

// module.exports = mongoose.model("Usuario", usuarioSheman)
export default mongoose.model('Usuario', usuarioSheman);