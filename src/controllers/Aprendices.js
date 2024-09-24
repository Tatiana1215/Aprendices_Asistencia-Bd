// listar todo
// listar por ficha 
// listar por id
// crear
// editar
// activar
// desactivar

// put: Actualiza
// post: Crear
// Delete: eliminar
// get:obtener información. listar

// request:pide y guarda el data
// resolve: responde

// const Aprendiz = require('../models/Aprendices')
import Aprendiz from '../models/Aprendices.js'
// import cloudinary from '../../config/cloudinaryConfig.js'
// import fs from 'fs'; // Para eliminar el archivo después de subirlo
import subirArchivo from '../helpers/subir_archivo.js';
import * as fs from 'fs'
import path from 'path'
import url from 'url'
import { v2 as cloudinary } from 'cloudinary'

const httpAprendiz = {
// --------------------
cargarArchivoCloud : async (req, res) => {
        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.API_KEY,
            api_secret: process.env.API_SECRET,
            secure: true
        });

        const { id } = req.params;
        try {
            //subir archivo
            const { tempFilePath } = req.files.archivo
            cloudinary.uploader.upload(tempFilePath,
                { width: 250, crop: "limit" },
                async function (error, result) {
                    if (result) {
                        let envio = await Aprendiz.findById(id);
                        if (envio.Firma) {
                            const nombreTemp = envio.Firma.split('/')
                            const nombreArchivo = nombreTemp[nombreTemp.length - 1] // hgbkoyinhx9ahaqmpcwl jpg
                            const [public_id] = nombreArchivo.split('.')
                            cloudinary.uploader.destroy(public_id)
                        }
                        envio = await Aprendiz.findByIdAndUpdate(id, { Firma: result.url })

                        res.json({ url: result.url });
                    } else {
                        res.json(error)
                    }

                })
        } catch (error) {
            res.status(400).json({ error, 'general': 'Controlador' })
        }
    },


    mostrarImagenCloud : async (req, res) => {
        const { id } = req.params

        try {
            let aprendiz = await Aprendiz.findById(id)
            if (aprendiz.Firma) {
                return res.json({ url: aprendiz.Firma})
            }
            res.status(400).json({ msg: 'Falta Imagen' })
        } catch (error) {
            res.status(400).json({ error })
        }
    },


    //listar todos los aprendices-------------------------------------------------------------------------------
    getAprendicesListarTodo: async (req, res) => {
        try {
            const Aprendices = await Aprendiz.find()
            if (Aprendices) {
                res.json(Aprendices)
            } else {
                res.status(404).json('No hay aprendices')
            }
        } catch (error) {
            res.status(400).json({ error })
        }
    },
    //lisar por ficha -----------------------------------------------------------------------------------------------
    getAprendizListarFicha: async (req, res) => {
        const { Id_Ficha } = req.params
        try {
            const aprendiz = await Aprendiz.find({ Id_Ficha })
            if (aprendiz) {
                res.json(aprendiz)
            } else {
                res.status(404).json('No existe esa ficha')
            }
        } catch (error) {
            res.status(400).json({ error })
        }
    },
    //listar por id-----------------------------------------------------------------------------------------------------
    getAprendizListarId: async (req, res) => {
        const { id } = req.params
        try {
            const aprendizId = await Aprendiz.findById(id)
            if (aprendizId) {
                res.json(aprendizId)
            } else {
                res.status(404).json('No existe ese aprendiz')
            }

        } catch (error) {
            res.status(400).json({ error })
        }
    },

    // insertar--------------------------------------------------------------------------------------------------------------
    postAprediz: async (req, res) => {
        const { Documento, Nombre, Telefono, Email, Id_Ficha } = req.body
        const file = req.file; // Multer maneja la subida de archivos
        if (!file) {
            return res.status(400).json({ mensaje: 'No file uploaded' });
        }        

        try {
            // Subir la firma del aprendiz a Cloudinary
            const uploadResult = await cloudinary.uploader.upload(file.path, {
                public_id: `${Nombre}_${Documento}_Firma`,
                folder: 'Firmas',
                fetch_format: 'auto',
                quality: 'auto',
            });

            const nuevoAprediz = new Aprendiz({
                Documento,
                Nombre,
                Telefono,
                Email,
                Id_Ficha,
                Firma: uploadResult.secure_url
            }); // Guardar la URL de la firma en la base de datos

            if (!nuevoAprediz) {
                return res.status(404).json({ error: "no se agrego el aprendiz" })
            }

            await nuevoAprediz.save();
            // Eliminar el archivo temporal después de subirlo
            // fs.unlinkSync(file.path);

            res.json(nuevoAprediz)
        } catch (error) {
            res.status(400).json({ error })
        }
    },
    //actualizar o editar-----------------------------------------------------------------------------------------------------
    putAprendiz: async (req, res) => {
        const { id } = req.params
        try {
            const { Documento, Nombre, Id_Ficha } = req.body
            const aprendiz = await Aprendiz.findById(id)
            if (aprendiz) {
                aprendiz.Documento = Documento
                aprendiz.Nombre = Nombre
                aprendiz.Id_Ficha = Id_Ficha
                await aprendiz.save()
                res.json(aprendiz)
            } else {
                res.status(404).json(`El aprendiz no existe`)
            }
        } catch (error) {
            res.status(400).json({ error })
        }
    },
    //activar-------------------------------------------------------------------------------------------------------------------
    putAprendizActivar: async (req, res) => {
        const { id } = req.params
        try {
            const AprendizActivar = await Aprendiz.findByIdAndUpdate(id, { Estado: 1 }, { new: true })
            if (AprendizActivar) {
                res.json(AprendizActivar)
            } else {
                res.status(404).json('El aprendiz no existe')
            }
        } catch (error) {
            res.status(400).json({ NativeError })
        }
    },
    //Desactivar-------------------------------------------------------------------------------------------------------------------
    putAprendizDesactivar: async (req, res) => {
        const { id } = req.params
        try {
            const AprendizDesactivar = await Aprendiz.findByIdAndUpdate(id, { Estado: 0 }, { new: true })
            if (AprendizDesactivar) {
                res.json(AprendizDesactivar)
            } else {
                res.status(404).json('No existe ese aprendiz')
            }
        } catch (error) {
            res.status(400).json(error)
        }
    }
}




export { httpAprendiz }