// crear
//listar todo
//actualizar
// Activar
//Desactivar


const Fichas = require("../models/Fichas")
// listar todo-------------------------------------------------------------------------------------------------------
const httpFichas = {
    getListar: async (req, res) => {
        try {
            const fichas = await Fichas.find()
            res.json(fichas)
        } catch (error) {
            res.status(400).json({ error })
        }
    },
    //crear-------------------------------------------------------------------------------------------------------------
    postFicha: async (req, res) => {
        
        try {
            const { Codigo, Nombre } = req.body
            const ficha = new Fichas({Codigo, Nombre})
            await ficha.save()
            res.json({ mensaje: "Ficha creada" })
        } catch (error) {
            res.status(400).json({ error })
        }
    },
    //actualizar-----------------------------------------------------------------------------------------------------------
    putFichaActualizar: async (req, res) => {
        const { id } = req.params
        try {
            const { Codigo, Nombre } = req.body
            const ficha = await Fichas.findById(id)
            if (ficha) {
                ficha.Codigo = Codigo
                ficha.Nombre = Nombre
                await ficha.save()
                res.json({ mensaje: "Ficha actualizada" })
            } else {
                res.status(404).json({ mensaje: "Ficha no actualizada" })
            }
            // const ficha = await Fichas.findByIdAndUpdate(idFicha, {Codigo, Nombre})
            // res.json({mensaje:"Ficha actualizada"})
        } catch (error) {
            res.status(400).json({ error })
        }
    },
    //Activar-------------------------------------------------------------------------------------------------------------------
    putActivarFicha: async (req, res) => {
        const {id} = req.params
        try {
            const fichaEstado = await Fichas.findByIdAndUpdate(id,{Estado:1}, { new: true })
            if (fichaEstado){
                res.json({mensaje:"Ficha Activada"})
            }else{
                res.json({mensaje:"La Ficha no se Activo"})
            }
        } catch (error) {
            res.status(400).json({ error })
        }
    },//Desactivar-------------------------------------------------------------------------------------------------------------
    PutDesactivarFicha: async (req, res) => {
         const {id} = req.params
        try {
            const fichaDesactivar =await Fichas.findByIdAndUpdate(id, {Estado:0}, { new: true })//El new: true es para que que actualicen los datos en la base de datos demongo
            if (fichaDesactivar){
                res.json({mensaje:"Ficha Desactivada"})
            }else{
                res.json({mensaje:"La Ficha no se Desactivo"})
            }
        } catch (error) {
            res.status(400).json({ error })
        }
    }
}

module.exports = {httpFichas}
