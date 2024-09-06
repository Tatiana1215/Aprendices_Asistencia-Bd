
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.js";
import {validarJWT} from '../middlewares/validarJWT.js'
import {httpAprendiz} from '../controllers/Aprendices.js'
import { aprendizHelper } from "../helpers/Aprendices.js";
import { Router } from "express";

// const { check } = require("express-validator");
// const { validarCampos } = require("../middlewares/validar-campos");
// const { validarJWT } = require("../middlewares/validarJWT");
// const { httpAprendiz } = require("../controllers/Aprendices");
// const { aprendizHelper } = require("../helpers/Aprendices");
// const { Router } = require("express");

const routers = Router()

//--------------------------------------------------------------------------------------------------------------------------
routers.get("/listarTodo", [
    validarJWT
], httpAprendiz.getAprendicesListarTodo)

// -------------------------------------------------------------------------------------------------------------------------
routers.get("/listarPorAprendiz/:id", [
      validarJWT,
    check('id', 'el id no es valido').isMongoId(),
    validarCampos,
  
], httpAprendiz.getAprendizListarId)

// -------------------------------------------------------------------------------------------------------------------------
routers.get("/listarPorFicha/:Id_Ficha", [
    check('Id_Ficha', 'El id no es valido').isMongoId(),
    validarCampos,
    validarJWT
], httpAprendiz.getAprendizListarFicha)

// -------------------------------------------------------------------------------------------------------------------------
routers.post("/Insertar", [
    validarJWT,
    check('Documento', 'El campo documento es obligatorio').notEmpty(),
    check('Documento').custom(aprendizHelper.existeDocumento),
    check('Documento', 'El numero de documento debe se maximo de 10 caracteres ').isLength({ min: 10 }),
    check('Nombre', 'El campo Nombre es obligatorio').notEmpty(),
    check('Nombre', 'El Nombre debe tener maximo 20 caracteres').isLength({max:20}),
    check('Telefono', 'El campo telefono es obligatorio').notEmpty(),
    check('Telefono', 'El numero de telefono debe tener 10 digitos').isLength({ min: 10 }),
    check('Email', 'El campo email es obligatorio').notEmpty(),
    check('Email').custom(aprendizHelper.existeEmail),
    // check('Email','El email no es correcto').isEmail(),
    check('Id_Ficha', 'El campo Id_Fecha es obligatorio').notEmpty(),
    validarCampos,
    // validarJWT
], httpAprendiz.postAprediz)

// ------------------------------------------------------------------------------------------------------------------------
routers.put("/Actualizar/:id", [
    check('id', 'El id no es valido').isMongoId(),
    check('Documento', 'El numero de documento debe se maximo de 10 caracteres ').isLength({ min: 10, max: 10 }),
    check('Telefono', 'El numero de telefono debe tener 10 digitos').isLength({ min: 10, max: 10 }),
    check('Nombre', 'El Nombre debe tener maximo 20 caracteres').isLength({max:20}),
    check('Documento').custom(async (Documento, { req }) => {
        await aprendizHelper.esDocumentoId(Documento, req.params.id);
    }),
    
    validarCampos,
    // validarJWT
], httpAprendiz.putAprendiz)

// ---------------------------------------------------------------------------------------------------------------------------
routers.put("/Activar/:id", [
    check('id', 'El id no es valido').isMongoId(),
    validarCampos,
    // validarJWT
], httpAprendiz.putAprendizActivar)

// ---------------------------------------------------------------------------------------------------------------------------
routers.put("/Desactivar/:id", [
    check('id', 'El id no es valido').isMongoId(),
    validarCampos,
    // validarJWT
], httpAprendiz.putAprendizDesactivar)

export default routers

