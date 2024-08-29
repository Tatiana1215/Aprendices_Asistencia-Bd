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

const Aprendiz = require('../models/Aprendices')
const httpAprendiz ={
 //listar todos los aprendices-------------------------------------------------------------------------------
getAprendicesListarTodo: async (req, res)=>{
    try {
        const Aprendices = await Aprendiz.find()
        if(Aprendices){
            res.json(Aprendices)
        }else{
            res.status(404).json('No hay aprendices')
        }
    } catch (error) {
     res.status(400).json({error})
    }
},
//lisar por ficha -----------------------------------------------------------------------------------------------
getAprendizListarFicha: async (req, res)=>{
const {Id_Ficha} = req.params
try {
 const aprendiz= await Aprendiz.find({Id_Ficha})
 if(aprendiz){
    res.json(aprendiz)
 }else{
    res.status(404).json('No existe esa ficha')
 }
} catch (error) {
    res.status(400).json({error})
}
},
//listar por id-----------------------------------------------------------------------------------------------------
getAprendizListarId: async (req, res)=>{
    const {id} = req.params
    try {
    const aprendizId = await Aprendiz.findById(id)    
    if(aprendizId){
        res.json(aprendizId)
    }else{
        res.status(404).json('No existe ese aprendiz')
    }

} catch (error) {
        res.status(400).json({error})
    }
},
// insertar--------------------------------------------------------------------------------------------------------------
postAprediz: async (req, res) =>{
    const {Documento, Nombre,Telefono,Email,Id_Ficha} = req.body
try {
    const nuevoAprediz= new Aprendiz({Documento, Nombre, Telefono,Email, Id_Ficha});
    await nuevoAprediz.save();
    res.json(nuevoAprediz)
} catch (error) {
    res.status(400).json({error})
}
},
//actualizar o editar-----------------------------------------------------------------------------------------------------
putAprendiz: async (req, res)=>{
    const {id} = req.params
    try {
        const {Documento, Nombre, Id_Ficha} =  req.body
        const aprendiz = await Aprendiz.findById(id)
        if(aprendiz){
            aprendiz.Documento = Documento
            aprendiz.Nombre = Nombre
            aprendiz.Id_Ficha = Id_Ficha
            await aprendiz.save()
            res.json(aprendiz)
        }else{
            res.status(404).json(`El aprendiz no existe`)
        }
    } catch (error) {
        res.status(400).json({error})
    }
},
//activar-------------------------------------------------------------------------------------------------------------------
putAprendizActivar: async (req, res)=>{
    const {id} = req.params
    try {
       const AprendizActivar = await Aprendiz.findByIdAndUpdate(id, { Estado: 1 }, { new: true})
       if(AprendizActivar){
       res.json(AprendizActivar)
       }else{
         res.status(404).json('El aprendiz no existe')
       }
    } catch (error) {
        res.status(400).json({NativeError})
    }
},
//Desactivar-------------------------------------------------------------------------------------------------------------------
putAprendizDesactivar: async (req, res)=>{
    const {id} = req.params
    try {
    const AprendizDesactivar = await Aprendiz.findByIdAndUpdate(id, { Estado: 0 }, { new:true })
    if(AprendizDesactivar){
        res.json(AprendizDesactivar)
    }else{
        res.status(404).json('No existe ese aprendiz')
    }
    } catch (error) {
        res.status(400).json(error)
    }
}
}

module.exports = {httpAprendiz}