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
    },
    esEmailId : async (Email, id) => {
        const email = await Aprendiz.findOne({Email})
        if(email && email._id.toString() !== id){
            throw new Error(`El numero de email ${Email} ya existe`)
        }
    },
    
    numTelefono: async (Telefono) => {
        const unico = await Aprendiz.findOne({Telefono})

        if(unico){
            throw new Error("El Numero de telefono ya existe")
        }
    }

}
export {aprendizHelper}