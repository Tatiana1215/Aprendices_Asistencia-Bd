// const Bitacora = require("../models/Bitacoras")
import Bitacora from "../models/Bitacoras.js"
import Aprendices from "../models/Aprendices.js"

const bitacoraHelper = {
    existeDocAprendiz: async (Documento)=>{
    const exists = await Aprendices.find({Documento})
    if(!exists){
        throw new Error("EL Documento del aprendiz no existe")
    }
},

unicoDocAprendiz: async (Documento)=>{
    const unico = await Aprendices.find({Documento})
    if (unico.length > 0) {
        throw new Error("El Documento del aprendiz ya existe");
    }
},


}
export {bitacoraHelper}