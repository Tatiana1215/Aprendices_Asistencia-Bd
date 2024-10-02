import { check } from "express-validator";
import {validarCampos} from "../middlewares/validar-campos.js"
import {validarJWT} from "../middlewares/validarJWT.js"
import {httpUsarios} from "../controllers/Usuarios.js"
import { usuarioHelper } from "../helpers/Usuarios.js";
import { Router } from "express";
import nodemailer from "nodemailer"

// const { check } = require("express-validator");
// const { validarCampos } = require("../middlewares/validar-campos");
// const { validarJWT } = require("../middlewares/validarJWT");
// const { httpUsarios } = require("../controllers/Usuarios");
// const { usuarioHelper } = require("../helpers/Usuarios");
// const { Router } = require("express")
const routers = Router()

// const nodemailer = require('nodemailer');

// -----------------------------------------------------------------------------------------------------------------------------------
routers.get("/listarTodos",[
    // validarCampos,
    // validarJWT
],httpUsarios.getUsuarios)

// routers.get("/listarPorUsuario",[
//     validarCampos,
// ])


// --------------------------------------------------------------------------------------------------------------------------------------
routers.post('/login',[
    check('Email','El campo email es obligatorio').notEmpty(),
    check('Password','El campo de contraseña es obligatorio').notEmpty(),
    validarCampos
], httpUsarios.postLogin)

// Ruta para solicitar recuperación de contraseña-----------------------------------------------------------------------------------------
routers.post('/solicitar-recuperacion', [
    check('Email','El campo email es obligatorio').notEmpty(),
    validarCampos
],httpUsarios.solicitarRecuperacionContrasena);
routers.post('/Verificacion',[
    check('Email','El campo email es obligatorio').notEmpty(),
    check('Codigo' , 'El campo Codigo es obligatorio').notEmpty(),
    validarCampos 
],httpUsarios.postVerificarCodigo );

// Ruta para restablecer la contraseña-----------------------------------------------------------------------------------------------------
routers.post('/reset/:id', [
    check('oldpassword', 'El campo de la contraseña actual es obligatorio').notEmpty(),
    check('Password', 'El campo del password es obligatorio').notEmpty(),
    check('Password','La contraseña debe tener minimo 10 caracteres y maximo 15').isLength({min:10, max:15}),
    validarCampos
],httpUsarios.restablecerContrasena);


// -------------------------------------------------------------------------------------------------------------------------------------
routers.post("/insertar",[
    // validarJWT,
check('Nombre','El campo Nombre es obligatorio').notEmpty(),
check('Email','El campo Email es obligatorio').notEmpty().isEmail,
check('Password','El campo password es obligatorio').notEmpty(),
check('Email').custom(usuarioHelper.existsEmail),
// check('Password').custom(usuarioHelper.existePassword),
check('Nombre','El Nombre debe tener maximo 30 caracteres').isLength({max:30}),
check('Password','La contraseña debe tener minimo 10 caracteres y maximo 15').isLength({min:10, max:15}),
validarCampos,
],httpUsarios.postUsuario)

// // -----------------------------------------------------------------------------------------------------------------------------------------
routers.put("/Actualizar/:id",[
    // validarJWT,
    check('id','El id no es valido').isMongoId(),
    // check('Email').custom(usuarioHelper.existsEmail),
    // check('Email','El email no es correcto').isEmail(),
    // check('Password').custom(usuarioHelper.existePassword),
    // check('Password','La contraseña debe tener minimo 10 caracteres y maximo 15').isLength({min:10, max:15}),
    check('Nombre','El Nombre debe tener maximo 30 caracteres').isLength({max:30}),
    check('Email').custom(async (Email, { req }) => {
        await usuarioHelper.esEmailid(Email, req.params.id);
    }),
    validarCampos
],httpUsarios.putUsuarioActualizar)

// --------------------------------------------------------------------------------------------------------------------------------------------
routers.put("/Activar/:id",[
    check('id','El no es valido').isMongoId(),
    validarCampos,
    // validarJWT
],httpUsarios.putUsuarioActivar)

// -------------------------------------------------------------------------------------------------------------------------------------------
routers.put("/Desactivar/:id",[
    check('id','El id no es valido').isMongoId(),
    validarCampos,
    // validarJWT
],httpUsarios.putUsuarioDesactivar)

// ------------------------------------------------------------------------------------------------------------------------------------------
routers.delete("/Eliminar/:id",[
    check('id','El id no es valido').isMongoId(),
    validarCampos,
    validarJWT
], httpUsarios.deleteUsario)

export default routers