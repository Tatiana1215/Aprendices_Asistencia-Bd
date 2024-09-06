// const Aprendiz = require("../models/Aprendices");
import Aprendiz from "../models/Aprendices.js"

const aprendizHelper = {
    existeDocumento : async (Documento) => {
        const existe = await Aprendiz.findOne({Documento: Documento})
        if(existe){
            throw new Error("Ya esta numero de Documento Ingresado");
        } 
    },
    existeEmail: async (Email)=>{
        const existe = await Aprendiz.findOne({Email: Email})
        if(existe){
            throw new Error("El email ya existe ingrese otro")
        }
    },
    esDocumentoId : async (Documento, id) => {
        const documento = await Aprendiz.findOne({Documento})
        if(documento && documento._id.toString() !== id){
            throw new Error(`El numero de documeto ${Documento} ya existe`)
        }
    }

}
export {aprendizHelper}