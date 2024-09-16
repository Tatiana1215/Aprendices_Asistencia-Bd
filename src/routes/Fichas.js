import { check } from "express-validator"
import { validarCampos } from "../middlewares/validar-campos.js"
import {validarJWT} from "../middlewares/validarJWT.js"
import {httpFichas} from "../controllers/Fichas.js"
import { fichaHelper } from "../helpers/Fichas.js"
import { Router } from "express"
import { httpBitacoras } from "../controllers/Bitacoras.js"

// const { Router } = require("express")
// const { check } = require("express-validator")
// const { validarCampos } = require('../middlewares/validar-campos')
// const { validarJWT } = require('../middlewares/validarJWT')
// const { httpFichas } = require("../controllers/Fichas")
// const { fichaHelper } = require("../helpers/Fichas")
// const { fichaHelper } = require("../helpers/Fichas")
const routers = Router()

// --------------------------------------------------------------------------------------------------------------
routers.get('/ListarTodo', [
    validarJWT,
], httpFichas.getListar)

// --------------------------------------------------------------------------------------------------------------
routers.post("/crear", [  

    validarJWT,
     check('Nombre', 'El campo nombre es obligatorio').notEmpty(),
    check('Codigo', ' El campo del codigo es obligatorio').notEmpty(),
    check('Codigo', 'El Codigo debe tener maximo 20 caracteres').isLength({max:20}),
    check('Nombre', ' EL Nombre debe tener maximo 50 caracteres ').isLength({ max:50 }),
    check('Codigo').custom(fichaHelper.existsCodigo),
    validarCampos,
    // validarJWT
], httpFichas.postFicha)

// --------------------------------------------------------------------------------------------------------------
routers.put("/Actualizar/:id", [
    check('id', 'el id es invalido').isMongoId(),
    // check('Codigo').custom(fichaHelper.existsCodigo),
    check('Codigo', 'El Codigo debe tener maximo 20 caracteres').isLength({ min:5, max:20 }),
    check('Nombre', ' EL Nombre debe tener maximo 50 caracteres ').isLength({ max: 50 }),
       check('Codigo').custom(async (Codigo, { req }) => {
        // Aquí usamos el helper para la validación
        await fichaHelper.esCodigoid(Codigo, req.params.id);
    }),
    validarCampos,
    // validarJWT
], httpFichas.putFichaActualizar)

// ----------------------------------------------------------------------------------------------------------------
routers.put("/Activar/:id", [
    check('id', 'El id valido').isMongoId(),
    // check('Estado', 'EL campo Estado es obligatorio').notEmpty(),
    validarCampos,
    // validarJWT
], httpFichas.putActivarFicha)

// -----------------------------------------------------------------------------------------------------------------
routers.put("/Desactivar/:id", [
    check('id', 'El id no es valido').isMongoId(),
    // check('Estado','El campo de Estado es obligatorio').notEmpty(),
    validarCampos,
    // validarJWT
], httpFichas.PutDesactivarFicha)

export default  routers