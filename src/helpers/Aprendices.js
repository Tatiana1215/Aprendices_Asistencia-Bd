const Aprendiz = require("../models/Aprendices");

const aprendizHelper = {
    existeDocumento : async (Documento) => {
        const existe = await Aprendiz.findOne({Documento: Documento})
        if(existe){
            throw new Error("Ya el numero de Documento Ingresado");
        } 
    },
    existeEmail: async (Email)=>{
        const existe = await Aprendiz.findOne({Email: Email})
        if(existe){
            throw new Error("El email ya existe ingrese otro")
        }
    }

}
module.exports = {aprendizHelper}