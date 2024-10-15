// crear
// listar
// actualizar
// eliminar
// Activar
// Desactivar

import Usuarios from '../models/Usuarios.js';
import bcrypt from "bcryptjs";
import nodemailer from 'nodemailer';
import { generarJWT } from '../middlewares/validarJWT.js';
import crypt from 'crypto'


const httpUsarios = {
  // listar----------------------------------------------------------------------------------------------------------
  getUsuarios: async (req, res) => {
    try {
      const usuarios = await Usuarios.find();
      if (usuarios) {
        res.json(usuarios);
      } else {
        res.json({ mensaje: "No hay usuarios" });
      }
    } catch (error) {
      res.status(400).json({ error });
    }
  },

  //cear--------------------------------------------------------------------------------------------------------------
  postUsuario: async (req, res) => {
    try {
      const { Email, Nombre, Password } = req.body;
      const usuarios = new Usuarios({ Email, Nombre, Password });

      const salt = bcrypt.genSaltSync(10);//Se utiliza para incriptar la contraseña
      usuarios.Password = bcrypt.hashSync(Password, salt);

      await usuarios.save();

      res.json(usuarios);
    } catch (error) {
      res.status(500).json({ error });
    }
  },

  //login--------------------------------------------------------------------------------------------------------------
  postLogin: async (req, res) => {
    const { Email, Password } = req.body;
    try {
      const usuario = await Usuarios.findOne({ Email });
      if (!usuario) {
        return res.status(401).json({
          mensaje: "Usuario / Password no son correctos",
        });
      }

      if (usuario.Estado === 0) {
        return res.status(401).json({
          mensaje: "Usuario Inactivo",
        });
      }
      // Comparar contraseñas
      const validPassword = bcrypt.compareSync(Password, usuario.Password);
      if (!validPassword) {
        return res.status(401).json({
          mensaje: "Usuario / Password no son correctos",
        });
      }

      const token = await generarJWT(usuario._id);
      return res.json({
        usuario: usuario,
        token,
      });

    } catch (error) {
      return res.status(501).json({
        mensaje: "Hable con el WebMaster",
      });
    }
  },

  //Actualizar-------------------------------------------------------------------------------------------------------
  putUsuarioActualizar: async (req, res) => {
    const { id } = req.params;
    try {
      const { Email, Nombre } = req.body;
      const usuario = await Usuarios.findById(id);
      if (usuario) {
        usuario.Email = Email;
        // usuario.Password = Password;
        usuario.Nombre = Nombre;

        // const salt = bcryptjs.genSaltSync(10);//Se utiliza para incriptar la contraseña
        // usuario.Password = bcryptjs.hashSync(Password, salt);
        await usuario.save();
        res.json({ mensaje: "Usuario Actualizado" });
      } else {
        res.status(404).json({ mensaje: "El usuario no se actualizo" });
      }
    } catch (error) {
      res.status(400).json({ error });
    }
  },
  //Activar-----------------------------------------------------------------------------------------------------------
  putUsuarioActivar: async (req, res) => {
    const { id } = req.params;
    try {
      const usuario = await Usuarios.findByIdAndUpdate(id, { Estado: 1 }, { new: true });
      if (usuario) {
        res.json({ mesaje: "Usuario Activado" });
      } else {
        res.status(404).json({ mensaje: "El usuario no se Activo" });
      }
    } catch (error) {
      res.status(400).json({ error });
    }
  },
  //Desactivar----------------------------------------------------------------------------------------------------------
  putUsuarioDesactivar: async (req, res) => {
    const { id } = req.params;
    try {
      const usuario = await Usuarios.findByIdAndUpdate(id, { Estado: 0 }, { new: true })
      if (usuario) {
        res.json({ mesaje: "Usuario Desactivado" });
      } else {
        res.status(404).json({ mensaje: "El usuario no se Desactivo" });
      }
    } catch (error) {
      res.status(400).json({ error });
    }
  },
  deleteUsario: async (req, res) => {
    const { id } = req.params;
    try {
      const usuario = await Usuarios.findByIdAndDelete(id);
      res.json({ mensaje: "Usuario eliminado" });
    } catch (error) {
      res.status(400).json({ error });
    }
  },


  // // Solicitar recuperación de contraseña------------------------------------------------------------------------------------

  solicitarRecuperacionContrasena: async (req, res) => {
    const { Email } = req.body;
    try {
      const usuario = await Usuarios.findOne({ Email });

      if (!usuario) {
        return res.status(404).json({ mensaje: "No existe usuario con ese email" });
      }


      usuario.resetPasswordExpires = Date.now() + 3600000; // 1 hora
      const codigoVerificacion = Math.floor(100000 + Math.random() * 900000); // Genera un código de 6 dígitos
      usuario.resetPasswordCodigo = codigoVerificacion;
      await usuario.save();


      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
        tls: {
          rejectUnauthorized: false, // Evita errores SSL en desarrollo
        }
      });

      const mailOptions = {
        to: usuario.Email,
        from: process.env.EMAIL_USER,
        subject: "Recuperación de Contraseña",
        text: `Estás recibiendo esto porque tú (o alguien más) ha solicitado restablecer la contraseña de tu cuenta.\n\n
        Copia o escribe el codigo de verificación.:\n\n
        ${codigoVerificacion}
        Si no solicitaste esto, simplemente ignora este correo y tu contraseña no cambiará.\n`,
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error("Error enviando el correo:", err); // Imprime detalles del error
          return res.status(500).json({ mensaje: "Error enviando el correo", error: err.mensaje });
        }
        res.json({ mensaje: "Correo enviado con éxito", info });
      });
    } catch (error) {
      // res.status(500).json({ error });
      res.status(500).json({ error: error.mensaje || "Error desconocido" });
    }
  },


  // Ruta de verificacion de codigo
  postVerificarCodigo: async (req, res) => {
    const { Email, Codigo } = req.body
    try {
      const usuario = await Usuarios.findOne({ Email })

      if (!usuario || usuario.resetPasswordCodigo !== Codigo) {
        return res.status(404).json({ mensaje: "Código incorrecto o expirado" })

      }
      if (Date.now() > usuario.resetPasswordExpires) {
        return res.status(404).json({ mensaje: "El código ha expirado" })
      }
      res.json({ mensaje: "Código verificado correctamente" })
    } catch (error) {
      res.status(500).json({ error: error.mensaje || "Error desconocido" });
    }
  },
  // // Restablecer contraseña---------------------------------------------------------------------------------------------------------------------
  restablecerContrasena: async (req, res) => {
    const { id } = req.params;
    const { oldpassword, Password } = req.body;

    try {
      // const usuario = await Usuarios.findOne({
      //   resetPasswordToken: token,
      //   resetPasswordExpires: { $gt: Date.now() },
      // });
      const usuario = await Usuarios.findById(id)
      if (!usuario) {
        return res.status(400).json({ mensaje: "El usuario no existe" });
      }

      if (!bcrypt.compareSync(oldpassword, usuario.Password)) {
        return res.status(401).json({ mensaje: "la contraseña es incorrecta" });
      }

      // Actualizar la contraseña del usuario
      const salt = bcrypt.genSaltSync(10);
      usuario.Password = bcrypt.hashSync(Password, salt);


      await usuario.save();

      res.json({ mensaje: "Contraseña restablecida correctamente" });
    } catch (error) {
      res.status(500).json({ error });
    }
  }
};

export { httpUsarios };
