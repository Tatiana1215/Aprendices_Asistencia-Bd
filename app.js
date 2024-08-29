const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()



const Usuario = require('./src/routes/Usuarios')
const Aprendiz = require('./src/routes/Aprendices')
const Bitacora = require('./src/routes/Bitacoras')
const Ficha = require('./src/routes/Fichas')

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/Usuario', Usuario)
app.use('/api/Aprendiz', Aprendiz)
app.use('/api/Bitacora', Bitacora)
app.use('/api/Ficha', Ficha)
 

app.listen(process.env.PORT, () => {
  console.log(`Servidor escuchando en el puerto:${process.env.PORT}`);
  mongoose.connect('mongodb://127.0.0.1:27017/Asistencia')
    .then(() => console.log('Connected!'))
})
