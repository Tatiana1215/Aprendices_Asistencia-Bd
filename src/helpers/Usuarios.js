
const Usuario = require("../models/Usuarios")

const usuarioHelper = {
    existsEmail: async (Email)=>{
    const exists = await Usuario.findOne({Email:Email})
    if(exists){
        throw new Error("El Email ya existe")
    }
    },
    existePassword: async (Password)=>{
        const existe = await Usuario.findOne({Password:Password})
        if(existe){
            throw new Error("La contraseña ya existe ingrese otra")
        }
    },
    existsEmail1: async (Email)=>{
        const exists = await Usuario.findOne({Email:Email})
        if(!exists){
            throw new Error("Usuario / Password no son correctos")
        }
},
esEmailid: async (Email, id) => {
    const email = await Usuario.findOne({ Email });
    if (email && email._id.toString() !== id) {
        throw new Error(`El Email ${Email} ya existe`);
    }
}
}

module.exports = {usuarioHelper}