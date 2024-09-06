// const express = require('express')
// const mongoose = require('mongoose')
// const cors = require('cors')
// require('dotenv').config()



// const Usuario = require('./src/routes/Usuarios')
// const Aprendiz = require('./src/routes/Aprendices')
// const Bitacora = require('./src/routes/Bitacoras')
// const Ficha = require('./src/routes/Fichas')

// const app = express()
// app.use(cors())
// app.use(express.json())

// app.use('/api/Usuario', Usuario)
// app.use('/api/Aprendiz', Aprendiz)
// app.use('/api/Bitacora', Bitacora)
// app.use('/api/Ficha', Ficha)
 

// app.listen(process.env.PORT, () => {
//   console.log(`Servidor escuchando en el puerto:${process.env.PORT}`);
//   mongoose.connect('mongodb://127.0.0.1:27017/Asistencia')
//     .then(() => console.log('Connected!'))
// })



import 'dotenv/config'
// import { Server } from './src/models/server'
import { Server } from './src/models/server.js'
// src/models/server.js
const server = new Server()
 server.listen()


// const Usuario = require('./src/routes/Usuarios')
// const Aprendiz = require('./src/routes/Aprendices')
// const Bitacora = require('./src/routes/Bitacoras')
// const Ficha = require('./src/routes/Fichas')

// const app = express()
// app.use(cors())
// app.use(express.json())

// app.use(express.static('public'))

// app.use('/api/Usuario', Usuario)
// app.use('/api/Aprendiz', Aprendiz)
// app.use('/api/Bitacora', Bitacora)
// app.use('/api/Ficha', Ficha)
 

// app.listen(process.env.PORT, () => {
//   console.log(`Servidor escuchando en el puerto:${process.env.PORT}`);
//   mongoose.connect('mongodb+srv://jeniffermendez07:1005450911@proyectofinal.iaz9f.mongodb.net/?retryWrites=true&w=majority&appName=proyectoFinal')
//     .then(() => console.log('Connected!'))
// })