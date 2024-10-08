
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
    check('Nombre', 'El Nombre debe tener maximo 50 caracteres').isLength({ max: 50 }),
    check('Telefono', 'El numero de telefono debe tener 10 digitos').isLength({ min: 10, max: 10 }),
    check('Documento', 'El numero de documento debe se maximo de 10 caracteres ').isLength({ min: 10, max: 10 }),
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
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('Id_Ficha','El campo Ficha es obligatorio').notEmpty(),
    check('Nombre', 'El Nombre debe tener maximo 50 caracteres').isLength({ max: 50 }),
    check('Telefono', 'El numero de telefono debe tener 10 digitos').isLength({ min: 10, max: 10 }),
    check('Documento', 'El numero de documento debe se maximo de 10 caracteres ').isLength({ min: 10, max: 10 }),
    check('Telefono', 'El numero de telefeono debe tener numeros').isNumeric(),
    check('Documento', 'El documento debe tener numeros').isNumeric(),
    check('Telefono').custom(async (Telefono, { req }) => {
        await aprendizHelper.esTelefonoId(Telefono, req.params.id);
    }),
    check('Email').custom(async (Email, { req }) => {
        await aprendizHelper.esEmailId(Email, req.params.id);
    }),
    check('Documento').custom(async (Documento, { req }) => {
        await aprendizHelper.esDocumentoId(Documento, req.params.id);
    }),
    validarCampos,
], httpAprendiz.putAprendiz)

// ---------------------------------------------------------------------------------------------------------------------------
routers.put("/Activar/:id", [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    validarCampos,
], httpAprendiz.putAprendizActivar)

// ---------------------------------------------------------------------------------------------------------------------------
routers.put("/Desactivar/:id", [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    validarCampos,
], httpAprendiz.putAprendizDesactivar)
// ---
routers.put("/cargarCloud/:id", [
    validarJWT,
    check('id').isMongoId(),
    // check('id').custom(aprendicesHelper.existeAprendizID),
    validarExistaArchivo,
    validarCampos
], httpAprendiz.cargarArchivoCloud);

routers.get("/uploadClou/:id", [ // img
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    // check('id').custom(aprendicesHelper.existeAprendizID), 
    validarCampos
], httpAprendiz.mostrarImagenCloud)
export default routers

