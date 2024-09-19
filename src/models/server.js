import express from 'express'
import mongoose from 'mongoose';
import cors from 'cors'
import http from 'http';
// import express from 'express'
// import { dbconnect } from "../../databases/config.js"
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import Usuario from '../../src/routes/Usuarios.js';
import Aprendiz from '../../src/routes/Aprendices.js';
import Bitacora from '../../src/routes/Bitacoras.js';
import Ficha from '../../src/routes/Fichas.js'


class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT
        this.Server = http.createServer(this.app);


        // middleware
        this.middlewares();

        // rutas de mi aplicación
        this.routes();

        // this.conectarbd()
    }
    // async conectarbd() {
    //     await dbconnect();
    // }


    middlewares() {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.static('public'));
        this.app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
    }


    routes() {
        this.app.use('/api/Usuario', Usuario)
        this.app.use('/api/Aprendiz', Aprendiz)
        this.app.use('/api/Bitacora', Bitacora)
        this.app.use('/api/Ficha', Ficha)
    }

    listen() {
        this.Server.listen(this.port, () => {
            console.log(`Servidor escuchando en el puerto:${process.env.PORT}`);
            mongoose.connect('mongodb+srv://jeniffermendez07:1005450911@proyectofinal.iaz9f.mongodb.net/?retryWrites=true&w=majority&appName=proyectoFinal')
                .then(() => console.log('Connected!'))
                // mongoose.connect('mongodb://127.0.0.1:27017/Asistencia')
                //     .then(() => console.log('Connected!'))
        })
    }
}

export {Server};