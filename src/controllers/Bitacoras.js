//  listar todo
// listar por ficha
// listar bitacora por aprendiz
//modificar
// crear
const Bitacoras = require("../models/Bitacoras")
const mongoose = require('mongoose');

const httpBitacoras = {

    getListar: async (req, res) => {
        try {
            const bitacoras = await Bitacoras.aggregate([
                {
                    $lookup: {
                        from: 'aprendizs', // Nombre de la colección de aprendices
                        localField: 'Id_Aprendiz',
                        foreignField: '_id',
                        as: 'aprendizInfo'
                    }
                },
                {
                    $unwind: '$aprendizInfo'
                },
                {
                    $lookup: {
                        from: 'fichas', // Nombre de la colección de fichas
                        localField: 'aprendizInfo.Id_Ficha',
                        foreignField: '_id',
                        as: 'fichaInfo'
                    }
                },
                {
                    $unwind: '$fichaInfo'
                },
                {
                    $project: {
                        _id: 1,
                        createdAt: { 
                            $dateToString: { 
                                format: "%d/%m/%Y %H:%M:%S", 
                                date: "$createdAt",
                                timezone: "America/Bogota"
                            } 
                        },
                        'nombreAprendiz': '$aprendizInfo.Nombre',
                        'telefonoAprendiz': '$aprendizInfo.Telefono',
                        'emailAprendiz': '$aprendizInfo.Email',
                        'nombreFicha': '$fichaInfo.Nombre'
                    }
                }
            ]);

            // Responder con los resultados de la búsqueda
            if (bitacoras.length > 0) {
                res.json(bitacoras);
            } else {
                res.status(404).json({ mensaje: "No hay bitácoras" });
            }
        } catch (error) {
            console.error("Error en getListarTodo:", error);
            res.status(500).json({ error: error.message });
        }
    },

    //   listar toda-----------------------------------------------------------------------------------------------------
    getListarTodo: async (req, res) => {
        try {
            const { FechaInicial, FechaFinal } = req.query;

            // Validar que las fechas estén proporcionadas
            if (!FechaInicial || !FechaFinal) {
                return res.status(400).json({ mensaje: "Fechas no proporcionadas" });
            }
            // Convertir las fechas a objetos Date
            const fechaInicial = new Date(FechaInicial);
            const fechaFinal = new Date(FechaFinal);

            // Validar que las fechas sean válidas
            if (isNaN(fechaInicial) || isNaN(fechaFinal)) {
                return res.status(400).json({ mensaje: "Formato de fecha no válido" });
            }
            const bitacoras = await Bitacoras.aggregate([
                {
                    $match: {
                        FechaHora: { $gte: fechaInicial, $lte: fechaFinal }
                    }
                },
                {
                    $lookup: {
                        from: 'aprendizs', // Nombre de la colección de aprendices
                        localField: 'Id_Aprendiz',
                        foreignField: '_id',
                        as: 'aprendizInfo'
                    }
                },
                {
                    $unwind: '$aprendizInfo'
                },
                {
                    $lookup: {
                        from: 'fichas', // Nombre de la colección de fichas
                        localField: 'aprendizInfo.Id_Ficha',
                        foreignField: '_id',
                        as: 'fichaInfo'
                    }
                },
                {
                    $unwind: '$fichaInfo'
                },
                {
                    $project: {
                        _id: 1,
                        // FechaHora:1,
                        FechaHora: { 
                            createdAt: { 
                                format: "%d/%m/%Y %H:%M:%S", 
                                date: "$createdAt",
                                timezone: "America/Bogota" // Cambia esto según la zona horaria que desees usar
                            } 
                        },
                        'nombreAprendiz': '$aprendizInfo.Nombre', // Asume que el campo del nombre es 'Nombre'
                        'telefonoAprendiz':'$aprendizInfo.Telefono',
                        'emailAprendiz':'$aprendizInfo.Email',
                        'nombreFicha': '$fichaInfo.Nombre' // Asume que el campo del nombre de la ficha es 'Nombre'
                    }
                }
            ]);
     
            // Responder con los resultados de la búsqueda
            if (bitacoras.length > 0) {
                res.json(bitacoras);
            } else {
                res.json({ mensaje: "No hay bitácoras en el rango de fechas proporcionado" }
                )}
        } catch (error) {
            console.error("Error en getListarBitacoras:", error);
            res.status(500).json({ error: error.message });
        }
    },
    //   listar por ficha-------------------------------------------------------------------------------------------------
    getListarBitacorasPorFicha: async (req, res) => {
        const { Id_Ficha } = req.params;
        try {
            console.log(`ID de Ficha recibido: ${Id_Ficha}`);

            // Verificar si Id_Ficha es un ObjectId válido
            if (!mongoose.Types.ObjectId.isValid(Id_Ficha)) {
                return res.status(400).json({ mensaje: "Id de ficha no válido" });
            }

            // Consulta de agregación para buscar bitácoras por Id_Ficha
            const result = await Bitacoras.aggregate([
                {
                    $lookup: {
                        from: 'aprendizs',
                        localField: 'Id_Aprendiz',
                        foreignField: '_id',
                        as: 'Aprendiz'
                    }
                },
                {
                    $unwind: '$Aprendiz'
                },
                {
                    $match: {
                        'Aprendiz.Id_Ficha': new mongoose.Types.ObjectId(Id_Ficha)
                    }
                },
                {
                    $project: {
                        _id: 1,
                        Id_Aprendiz: 1,
                        createdAt: 1,
                        'Aprendiz.Id_Ficha': 1,
                        'Aprendiz.Documento': 1,
                        'Aprendiz.Nombre': 1
                    }
                }
            ]);

            // Verificar si se encontraron resultados
            if (result) {
                res.json(result);
            } else {
                res.json({ mensaje: "No hay bitácoras para la ficha proporcionada" });
            }
        } catch (error) {
            console.error("Error en getListarBitacorasPorFicha:", error);
            res.status(500).json({ error: error.message });
        }
    },
    //listar por aprendiz---------------------------------------------------------------------------------------------------------------
    getLitarBitacorasporAprendiz: async (req, res) => {
        const { Id_Aprendiz } = req.params
        try {
            const aprendiz = await Bitacoras.find({ Id_Aprendiz })
            if (aprendiz) {
                res.json(aprendiz)
            } else {
                res.json({ mensaje: "No existe el aprendiz en las bitacoras " })
            }
        } catch (error) {

        }
    },
    // Insertar bitacora----------------------------------------------------------------------------------------------------------------
    postInsertaBitacora: async (req, res) => {
        try {
            const { Id_Aprendiz} = req.body
            const bitacora = new Bitacoras({ Id_Aprendiz })
            const resultado = await bitacora.save()
            res.json({ mensaje: "Se inserto los datos correctamente", resultado })
        } catch (error) {
            res.status(400).json({ error })
        }
    },
    // Modificar Bitacora------------------------------------------------------------------------------------------------------------------
    putModificarBitacora: async (req, res) => {
        const { id } = req.params
        try {

            const bitacora = await Bitacoras.findById(id)
            const { Id_Aprendiz, FechaHora } = req.body
            if (bitacora) {
                bitacora.Id_Aprendiz = Id_Aprendiz
                bitacora.FechaHora = FechaHora
                await bitacora.save()
                res.json({ mensaje: "Datos Actualizados correctamente" })
            } else {
                res.status(401).json({ mensaje: "los datsos no se actualizaron" })
            }
        } catch (error) {
            res.status(400).json({ error })
        }
    }

}
module.exports = { httpBitacoras }
