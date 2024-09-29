import { check, header } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.js";
import {validarJWT, generarJWT} from '../middlewares/validarJWT.js'
import {httpBitacoras} from '../controllers/Bitacoras.js'
import { bitacoraHelper } from "../helpers/Bitacoras.js";
import { Router } from "express";

const routers = Router()
routers.get("/listar",[
    validarJWT
    ],httpBitacoras.getListar)
    
// -----------------------------------------------------------------------------------------------------
routers.get("/ListarBitacoras",[
// validarJWT
],httpBitacoras.getListarTodo)
// -----------------------------------------------------------------------------------------------------


routers.get("/listaFechaFicha",[
    // check('Codigo', 'El campo codigo se requiere').notEmpty(),
    validarCampos
],httpBitacoras.obtenerBitacorasPorFichaYFecha)


routers.get("/listaFechasFicha",[
],httpBitacoras.getListarBitacorasPorFichaYFechas)

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
    // check('Id_Aprendiz','El id aprendiz no es valido').isMongoId(),
    check('Documento', 'El campo del Documento es obligatorio').notEmpty(),
    check("Documento").custom(bitacoraHelper.existeDocAprendiz),
    check("Documento",'El campo de Documento debe tener maximo 10 caracteres').isLength({max:10}),
    check("Documento",'El numero de documento deben ser numeros').isNumeric(),
    check("Documento").custom(bitacoraHelper.validarDocumento),
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


export default  routers