
// const Ficha = require("../models/Fichas")
import Ficha from "../models/Fichas.js";

const fichaHelper = {
    existsCodigo: async (Codigo)=>{
        const exists = await Ficha.findOne({Codigo:Codigo})
        if(exists){
            throw new Error("El codigo ya existe")
        }
    },

  esCodigoid: async (Codigo, id) => {
        const codigo = await Ficha.findOne({ Codigo });
        if (codigo && codigo._id.toString() !== id) {
            throw new Error(`El código ${Codigo} ya existe`);
        }
    }
}

// const fichaHelper = {
//   
// };
export {fichaHelper}
