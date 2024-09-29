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
validarDocumento: async (Documento) => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Establecer la hora a 00:00:00

    const aprendiz = await Aprendices.findOne({ Documento });

    if (aprendiz) {
        // Verificar si ya existe una bitácora para este aprendiz hoy
        const bitacoraHoy = await Bitacora.findOne({
            Id_Aprendiz: aprendiz._id,
            createdAt: { $gte: hoy }
        });

        if (bitacoraHoy) {
            throw new Error("El Documento del aprendiz ya fue ingresado hoy");
        } else {
            // Crear una nueva bitácora para hoy
            const nuevaBitacora = new Bitacora({
                Id_Aprendiz: aprendiz._id,
                // Estado: 'Asistio' // O el estado que corresponda
            });
            await nuevaBitacora.save();
            return "Asistencia registrada correctamente";
        }
    } else {
        throw new Error("El Documento del aprendiz no existe");
    }
}


}

export {bitacoraHelper}