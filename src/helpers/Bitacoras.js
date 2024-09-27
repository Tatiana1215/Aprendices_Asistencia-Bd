// const Bitacora = require("../models/Bitacoras")
import Bitacora from "../models/Bitacoras.js"
import Aprendices from "../models/Aprendices.js"

const bitacoraHelper = {
    existeDocAprendiz: async (Documento)=>{
    const exists = await Aprendices.findOne({Documento})
    if(!exists){
        throw new Error("EL Documento del aprendiz no existe")
    }
},

// unicoDocAprendiz: async (Documento) => {
//     const unico = await Aprendices.findOne({ Documento });
//     if (unico) {
//         throw new Error("El Documento del aprendiz ya existe");
//     }
// }




}
// Función para validar el ingreso del documento
async function validarDocumento(Documento) {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Establecer la hora a 00:00:00
  
    const aprendiz = await Aprendices.findOne({ Documento });
  
    if (aprendiz) {
      if (aprendiz.ultimoIngreso && aprendiz.ultimoIngreso >= hoy) {
        throw new Error("El Documento del aprendiz ya fue ingresado hoy");
      } else {
        // Actualizar la fecha de último ingreso
        aprendiz.ultimoIngreso = new Date();
        await aprendiz.save();
        return "Documento actualizado correctamente";
      }
    } else {
      // Crear un nuevo registro si el documento no existe
      const nuevoAprendiz = new Aprendices({
        Documento,
        ultimoIngreso: new Date()
      });
      await nuevoAprendiz.save();
      return "Nuevo documento registrado correctamente";
    }
  }
export {bitacoraHelper}