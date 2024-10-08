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
import mongoose from 'mongoose';


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
                        Estado: 1,
                        createdAt: {
                            $dateToString: {
                                format: "%d/%m/%Y %H:%M:%S",
                                date: "$createdAt",
                                timezone: "America/Bogota"
                            }
                        },
                        'nombreAprendiz': '$aprendizInfo.Nombre',
                        'documentoAprendiz': '$aprendizInfo.Documento',
                        'telefonoAprendiz': '$aprendizInfo.Telefono',
                        'emailAprendiz': '$aprendizInfo.Email',
                        'nombreFicha': '$fichaInfo.Nombre',
                        'numeroFicha': '$fichaInfo.Codigo'
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
        const { fichaNumero, FechaInicial, FechaFinal } = req.query;

        try {
            // Validaciones
            if (!fichaNumero) {
                return res.status(400).json({ mensaje: "El número de ficha es requerido" });
            }

            if (!FechaInicial || !FechaFinal) {
                return res.status(400).json({ mensaje: "Las fechas inicial y final son requeridas" });
            }

            // Convertir fechas
            const startDate = new Date(FechaInicial);
            const endDate = new Date(FechaFinal);
            endDate.setHours(23, 59, 59, 999);

            // Validar que las fechas sean válidas
            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                return res.status(400).json({ mensaje: "Formato de fecha no válido" });
            }

            // Validar que la fecha inicial no sea mayor que la fecha final
            if (startDate > endDate) {
                return res.status(400).json({ mensaje: "La fecha inicial no puede ser mayor que la fecha final" });
            }


            // Buscar la ficha
            const ficha = await Fichas.findOne({ Codigo: fichaNumero });
            if (!ficha) {
                return res.status(404).json({ mensaje: 'Ficha no encontrada' });
            }

            const pipeline = [
                // Etapa 1: Filtrar bitácoras por fecha
                {
                    $match: {
                        createdAt: { $gte: startDate, $lte: endDate }
                    }
                },
                // Etapa 2: Unir con la colección de Aprendices
                {
                    $lookup: {
                        from: 'aprendizs',
                        localField: 'Id_Aprendiz',
                        foreignField: '_id',
                        as: 'aprendizInfo'
                    }
                },
                // Etapa 3: Deshacer el array resultante del lookup
                {
                    $unwind: '$aprendizInfo'
                },
                // Etapa 4: Unir con la colección de Fichas
                {
                    $lookup: {
                        from: 'fichas',
                        localField: 'aprendizInfo.Id_Ficha',
                        foreignField: '_id',
                        as: 'fichaInfo'
                    }
                },
                // Etapa 5: Deshacer el array resultante del lookup
                {
                    $unwind: '$fichaInfo'
                },
                // Etapa 6: Filtrar por número de ficha
                {
                    $match: {
                        'fichaInfo.Codigo': fichaNumero
                    }
                },
                // Etapa 7: Proyectar los campos necesarios
                {
                    $project: {
                        _id: 1,
                        nombreAprendiz: '$aprendizInfo.Nombre',
                        documentoAprendiz: '$aprendizInfo.Documento',
                        telefonoAprendiz: '$aprendizInfo.Telefono',
                        emailAprendiz: '$aprendizInfo.Email',
                        nombreFicha: '$fichaInfo.Nombre',
                        numeroFicha: '$fichaInfo.Codigo',
                        createdAt: {
                            $dateToString: {
                                format: "%d/%m/%Y %H:%M:%S",
                                date: "$createdAt",
                                timezone: "America/Bogota"
                            }
                        },
                        Estado: 1
                    }
                }
            ];

            const bitacoras = await Bitacoras.aggregate(pipeline);

            if (bitacoras.length === 0) {
                return res.status(404).json({ mensaje: 'No hay asistencias registradas' });
            }

            res.json(bitacoras);
        } catch (error) {
            console.error('Error al listar bitácoras:', error);
            res.status(500).json({ mensaje: 'Error al listar bitácoras', error: error.message });
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
                        Estado: 1,
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

    getListarBitacorasPorFichaYFechas: async (req, res) => {
        const { Id_Ficha, FechaInicial, FechaFinal } = req.query;

        try {
            // Verificar si Id_Ficha es un ObjectId válido
            if (!mongoose.Types.ObjectId.isValid(Id_Ficha)) {
                return res.status(400).json({ mensaje: "Id de ficha no válido" });
            }

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

            // Consulta de agregación para buscar bitácoras por Id_Ficha y fechas
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
                        'Aprendiz.Id_Ficha': new mongoose.Types.ObjectId(Id_Ficha),
                        createdAt: {
                            $gte: fechaInicial,
                            $lte: fechaFinal
                        }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        Estado: 1,
                        createdAt: {
                            $dateToString: {
                                format: "%d/%m/%Y %H:%M:%S",
                                date: "$createdAt",
                                timezone: "America/Bogota"
                            }
                        },
                        'Aprendiz.Nombre': 1,
                        'Aprendiz.Documento': 1
                    }
                }
            ]);

            if (result.length > 0) {
                res.json(result);
            } else {
                res.json({ mensaje: "No hay bitácoras para la ficha y rango de fechas proporcionados" });
            }

        } catch (error) {
            console.error("Error en getListarBitacorasPorFichaYFechas:", error);
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
            const { Documento } = req.body

            // Buscar al aprendiz por el número de documento
            const aprendiz = await Aprendices.findOne({ Documento })

            // Verificar si el aprendiz existe
            if (!aprendiz) {
                return res.status(404).json({ mensaje: 'No se encontró un aprendiz con ese numero  documento' })
            }

            // Crear la bitácora con el Id del aprendiz
            const bitacora = new Bitacoras({ Id_Aprendiz: aprendiz.id })
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
            const { Id_Aprendiz } = req.body
            if (bitacora) {
                bitacora.Id_Aprendiz = Id_Aprendiz
                // bitacora.FechaHora = FechaHora
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

            // Enviar la respuesta con la bitácora actualizada
            res.json(bitacora);
        } catch (error) {
            console.error('Error al actualizar estado:', error.message);
            res.status(500).json({ error: 'Error al actualizar estado' });
        }
    },

    obtenerBitacorasPorFichaYFecha: async (req, res) => {
        const { fichaNumero, fecha } = req.query;

        if (!fecha) {
            return res.status(400).json({ message: 'La fecha es requerida' });
        }

        // Validar formato de fecha (YYYY-MM-DD)
        const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!fechaRegex.test(fecha)) {
            return res.status(400).json({ message: 'El formato de la fecha es incorrecto' });
        }

        try {
            // Buscar el ObjectId de la ficha usando el número de ficha
            const ficha = await Fichas.findOne({ Codigo: fichaNumero });
            if (!ficha) {
                return res.status(404).json({ message: 'Ficha no encontrada' });
            }

            // Buscar todos los aprendices que tienen esta ficha
            const aprendices = await Aprendices.find({ Id_Ficha: ficha._id });
            if (aprendices.length === 0) {
                return res.status(404).json({ message: 'No se encontraron aprendices para esta ficha' });
            }

            // Extraer el año, mes y día del parámetro fecha
            const year = fecha.substring(0, 4);
            const month = fecha.substring(5, 7);
            const day = fecha.substring(8, 10);

            const startDate = new Date(`${year}-${month}-${day}T00:00:00.000Z`);
            const endDate = new Date(`${year}-${month}-${day}T23:59:59.999Z`);

            // Buscar bitácoras para los aprendices que asistieron en la fecha especificada
            const bitacoras = await Bitacoras.find({
                createdAt: { $gte: startDate, $lte: endDate },
                Id_Aprendiz: { $in: aprendices.map(a => a._id) },
                Estado: 'Asistio'
            }).populate('Id_Aprendiz', 'Nombre Documento Email Telefono Firma Id_Ficha')
            .populate('Id_Ficha', 'Nombre Codigo'); // Asegúrate de que esto esté presente;

            // Si no hay bitácoras, responde con un mensaje adecuado
            if (bitacoras.length === 0) {
                return res.status(404).json({ message: 'No hay asistencias registradas.' });
            }
           // Accede al aprendiz
            // Formatear la respuesta para incluir los valores deseados
            const formattedBitacoras = bitacoras.map(bitacora => ({
                documento: bitacora.Id_Aprendiz.Documento,
                nombre: bitacora.Id_Aprendiz.Nombre,
                emailAprendiz: bitacora.Id_Aprendiz.Email,
                telefonoAprendiz: bitacora.Id_Aprendiz.Telefono,
                nombreFicha:ficha.Nombre,
                numeroFicha: ficha.Codigo,
                firma: bitacora.Id_Aprendiz.Firma
            }));


            res.status(200).json(formattedBitacoras);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }


}

export { httpBitacoras }
