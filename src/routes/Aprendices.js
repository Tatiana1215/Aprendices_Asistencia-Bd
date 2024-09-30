
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from '../middlewares/validarJWT.js'
import { httpAprendiz } from '../controllers/Aprendices.js'
import validarExistaArchivo from '../middlewares/validar_file.js';
import { aprendizHelper } from "../helpers/Aprendices.js";
import { Router } from "express";
import express from 'express';
// import multer from 'multer';
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
    check('Nombre', 'El campo Nombre es obligatorio').notEmpty(),
    check('Telefono', 'El campo telefono es obligatorio').notEmpty(),
    check('Documento', 'El campo documento es obligatorio').notEmpty(),
    check('Email', 'El campo email es obligatorio').notEmpty(),
    check('Id_Ficha', 'El campo Id_Ficha es obligatorio').notEmpty(),
    check('Nombre', 'El Nombre debe tener maximo 20 caracteres').isLength({ max: 20 }),
    check('Telefono', 'El numero de telefono debe tener 10 digitos').isLength({ max: 10 }),
    check('Documento', 'El numero de documento debe ser maximo de 10 caracteres ').isLength({ max: 10 }),
    check('Telefono').custom(aprendizHelper.numTelefono),
    check('Documento').custom(aprendizHelper.existeDocumento),
    check('Telefono', 'El numero de telefeono debe tener numeros').isNumeric(),
    check('Documento', 'El documento debe tener numeros').isNumeric(),
    check('Email').custom(aprendizHelper.existeEmail),
    
    validarCampos,
    // validarJWT

], httpAprendiz.postAprediz,)


// ------------------------------------------------------------------------------------------------------------------------
routers.put("/Actualizar/:id", [
    check('id', 'El id no es valido').isMongoId(),
    check('Nombre', 'El Nombre debe tener maximo 20 caracteres').isLength({ max: 20 }),
    check('Telefono', 'El numero de telefono debe tener 10 digitos').isLength({ min: 10, max: 10 }),
    check('Documento', 'El numero de documento debe se maximo de 10 caracteres ').isLength({ min: 10, max: 10 }),
    check('Telefono', 'El numero de telefeono debe tener numeros').isNumeric(),
    check('Documento', 'El documento debe tener numeros').isNumeric(),
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
// ---
routers.put("/cargarCloud/:id", [
    // validarJWT,
    check('id').isMongoId(),
    // check('id').custom(aprendicesHelper.existeAprendizID),
    validarExistaArchivo,
    validarCampos
], httpAprendiz.cargarArchivoCloud);

routers.get("/uploadClou/:id", [ // img
    // validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    // check('id').custom(aprendicesHelper.existeAprendizID), 
    validarCampos
], httpAprendiz.mostrarImagenCloud)
export default routers

