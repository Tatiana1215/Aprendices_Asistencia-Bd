const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT, generarJWT } = require("../middlewares/validarJWT");
const { httpBitacoras } = require("../controllers/Bitacoras");
const { Router } = require("express");
const { bitacoraHelper } = require("../helpers/Bitacoras");
const routers = Router()
routers.get("/listar",[
    validarJWT
    ],httpBitacoras.getListar)
    
// -----------------------------------------------------------------------------------------------------
routers.get("/ListarBitacoras",[
// validarJWT
],httpBitacoras.getListarTodo)

// -----------------------------------------------------------------------------------------------------
routers.get("/ListaPorFicha/:Id_Ficha",[
check('Id_Ficha', 'El id no es valido').isMongoId(),
validarCampos,
validarJWT
], httpBitacoras.getListarBitacorasPorFicha)

// -----------------------------------------------------------------------------------------------------
routers.get("/listarPorAprendiz/:Id_Aprendiz",[
check('Id_Aprendiz','El id no es valido').isMongoId(),
validarCampos,
validarJWT
],httpBitacoras.getLitarBitacorasporAprendiz)
// 
// ----------------------------------------------------------------------------------------------------
routers.post("/Insertar",[
    // validarJWT,
    check('Id_Aprendiz','El id aprendiz no es valido').isMongoId(),
    check('Id_Aprendiz', 'El campo id del aprendiz es onbligatorio').notEmpty(),
    check("Id_Aprendiz").custom(bitacoraHelper.existeIdAprendiz),
    check("Id_Aprendiz").custom(bitacoraHelper.unicoIdAprendiz),
    validarCampos,
],httpBitacoras.postInsertaBitacora)

// -------------------------------------------------------------------------------------------------------
routers.put("/Actualizar/:id",[
    validarJWT,
    check('id','El id es invalido').isMongoId(),
    validarCampos,

],httpBitacoras.putModificarBitacora)

// ----------------------------------------------------------------------------------------------------------
routers.put("/actualizarEstado/:id",[

],httpBitacoras.putActualizarEstado)
module.exports = routers