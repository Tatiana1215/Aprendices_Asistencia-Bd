//  listar todo
// listar por ficha
// listar bitacora por aprendiz
//modificar
// crear
// const Bitacoras = require("../models/Bitacoras")
// const mongoose = require('mongoose');
import Aprendices from '../models/Aprendices.js'
import Fichas from '../models/Fichas.js'
import Bitacoras from '../models/Bitacoras.js'

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
                        Estado:1,
                        createdAt: {
                            $dateToString: {
                                format: "%d/%m/%Y %H:%M:%S",
                                date: "$createdAt",
                                timezone: "America/Bogota"
                            }
                        },
                        'nombreAprendiz': '$aprendizInfo.Nombre',
                        'documentoAprendiz':'aprendizInfo.Documento',
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
            // console.log(req);


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
                        createdAt: {    $gte: fechaInicial,
                            $lte: fechaFinal }
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
                        Estado:1,
                        createdAt: {
                            $dateToString: {
                                format: "%d/%m/%Y %H:%M:%S",
                                date: "$createdAt",
                                timezone: "America/Bogota"
                            }
                        },
                        'nombreAprendiz': '$aprendizInfo.Nombre', // Asume que el campo del nombre es 'Nombre'
                        'documentoAprendiz':'aprendizInfo.Documento',
                        'telefonoAprendiz': '$aprendizInfo.Telefono',
                        'emailAprendiz': '$aprendizInfo.Email',
                        'nombreFicha': '$fichaInfo.Nombre' // Asume que el campo del nombre de la ficha es 'Nombre'
                    }
                }
            ]);

            // Responder con los resultados de la búsqueda
            if (bitacoras.length > 0) {
                res.json(bitacoras);
            } else {
                res.json({ msg: "No hay bitácoras en el rango de fechas proporcionado" }
                )
            }
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
                        Estado:1,
                        Id_Aprendiz: 1,
                        createdAt: {
                            $dateToString: {
                                format: "%d/%m/%Y ",
                                date: "$createdAt",
                                timezone: "America/Bogota"
                            }
                        },
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
            const { Id_Aprendiz } = req.body
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
    },
    // Actualizar Estado----------------------------------------------------------------------------------------------------------------
    // putActualizarEstado: async (req, res) => {
    //     const { id } = req.params
    //     const { Estado } = req.body
    //     try {

    //         // const validEstados = ['Asistio', 'No Asistio', 'Excusa', 'Pendiente'];
    //         // if (!validEstados.includes(Estado)) {
    //         //     return res.status(400).json({ msg: "Estado no válido" });
    //         // }

    //         const bitacora = await Bitacoras.findByIdAndUpdate(id, { Estado }, { new: true })

    //         if (!bitacora) {
    //             res.status(404).json({ msg: 'Bitacora no encontrada' })
    //         }
    //         await bitacora.save()
    //         res.json(bitacora)
    //     } catch (error) {
    //         console.log('error al actualizar estado', error)
    //         res.status(500).json({ error: 'Error al actualizar estado' })
    //     }
    // }
    putActualizarEstado: async (req, res) => {
        const { id } = req.params;
        const { Estado } = req.body;
    
        try {
            const validEstados = ['Asistio', 'No Asistio', 'Excusa', 'Pendiente'];
            console.log("Estado recibido en el servidor:", Estado);
    
            // Verificar si el estado es válido
            if (!validEstados.includes(Estado)) {
                console.log("Estado no válido:", Estado);
                return res.status(400).json({ msg: "Estado no válido" });
            }
    
            // Buscar la bitácora por ID y actualizar el estado
            const bitacora = await Bitacoras.findByIdAndUpdate(id, { Estado }, { new: true });
    
            // Verificar si se encontró la bitácora
            if (!bitacora) {
                return res.status(404).json({ msg: 'Bitacora no encontrada' });
            }
    
            // Guardar la bitácora actualizada
            await bitacora.save();
    
            // Enviar la respuesta con la bitácora actualizada
            res.json(bitacora);
        } catch (error) {
            console.error('Error al actualizar estado:', error.message);
            res.status(500).json({ error: 'Error al actualizar estado' });
        }
    },

    obtenerBitacorasPorFichaYFecha: async (req, res) => {

        try {
            const { fichaNumero, fecha } = req.query;

            // Buscar el ObjectId de la ficha usando el número de ficha
            const ficha = await Fichas.findOne({ numero: fichaNumero });
            if (!ficha) {
                return res.status(404).json({ message: 'Ficha no encontrada' });
            }

            // Buscar todos los aprendices que tienen esta ficha
            const aprendices = await Aprendices.find({ fichas: ficha._id });
            if (aprendices.length === 0) {
                return res.status(404).json({ message: 'Aprendiz no encontrado' });
            }

            // Extraer el año, mes y día del parámetro fecha
            const year = fecha.substring(0, 4);
            const month = fecha.substring(5, 7);
            const day = fecha.substring(8, 10);

            const startDate = new Date(`${year}-${month}-${day}T00:00:00.000Z`);
            const endDate = new Date(`${year}-${month}-${day}T23:59:59.999Z`);

            // Buscar bitácoras para los aprendices que asistieron en la fecha especificada
            const bitacoras = await Bitacora.find({
                createdAt: { $gte: startDate, $lte: endDate },
                aprendiz: { $in: aprendices.map(a => a._id) },
                estado: 'asistió' // Filtrar por estado "asistió"
            }).populate('aprendiz', 'nombre documento'); // Reemplaza 'nombre documento' con los campos que desees

            // Formatear la respuesta para incluir los valores deseados
            const formattedBitacoras = bitacoras.map(bitacora => ({
                documento: bitacora.aprendiz.documento,
                nombre: bitacora.aprendiz.nombre,
                createdAt: bitacora.createdAt,
                // Añade otros campos que desees incluir
            }));

            res.status(200).json(formattedBitacoras);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }


    }
    

}
 
export { httpBitacoras }
