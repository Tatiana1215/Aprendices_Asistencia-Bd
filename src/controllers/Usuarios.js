// crear
// listar
// actualizar
// eliminar
// Activar
// Desactivar

const Usuarios = require("../models/Usuarios");
const bcryptjs = require("bcryptjs");
const { generarJWT } = require("../middlewares/validarJWT");
const { config } = require("dotenv");
const { usuarioHelper } = require("../helpers/Usuarios");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

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
      const { Email, Password, Nombre } = req.body;
      const usuarios = new Usuarios({ Email, Password, Nombre });

      const salt = bcryptjs.genSaltSync(10);//Se utiliza para incriptar la contraseña
      usuarios.Password = bcryptjs.hashSync(Password, salt);

      await usuarios.save();
      // res.json({mensaje:"Usuario creado"})
      res.json(usuarios);
    } catch (error) {
      res.status(400).json({ error });
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
      const validPassword = bcryptjs.compareSync(Password, usuario.Password);
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
      const { Email,Nombre } = req.body;
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
        res.json({ mesaje: "Usuario Actualizado" });
      } else {
        res.status(404).json({ mensaje: "El usuario no se actualizo" });
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
        res.json({ mesaje: "Usuario Desactivo" });
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

  // solicitarRecuperacionContrasena : async (req, res) => {
  //   const { Email } = req.body;
  //   try {
  //     const usuario = await Usuarios.findOne({ Email });
  //     if (!usuario) {
  //       return res.status(404).json({ mensaje: "No existe usuario con ese email" });
  //     }
  //     // res.json('E usuario es correcto')

  //     // // Crear un token único para el usuario
  //     const token = crypto.randomBytes(20).toString('hex');

  //     // // Establecer la fecha de expiración del token
  //     usuario.resetPasswordToken = token;
  //     usuario.resetPasswordExpires = Date.now() + 3600000; // 1 hora

  //     await usuario.save();

  //     // Configurar el transporter para enviar correos
  //     const transporter = nodemailer.createTransport({
  //       service: "Gmail",
  //       auth: {
  //         user: process.env.EMAIL_USER,
  //         pass: process.env.EMAIL_PASS,
  //       },
  //     });

  //     // Enviar correo con el enlace para restablecer la contraseña
  //     const mailOptions = {
  //       to: usuario.Email,
  //       from: process.env.EMAIL_USER,
  //       subject: "Recuperación de Contraseña",
  //       text: `Estás recibiendo esto porque tú (o alguien más) ha solicitado restablecer la contraseña de tu cuenta.\n\n
  //       Haz clic en el siguiente enlace, o pégalo en tu navegador para completar el proceso:\n\n
  //       http://${req.headers.host}/reset/${token}\n\n
  //       Si no solicitaste esto, simplemente ignora este correo y tu contraseña no cambiará.\n`,
  //     };

  //     transporter.sendMail(mailOptions, (err) => {
  //       if (err) {
  //         return res.status(500).json({ mensaje: "Error enviando el correo" });
  //       }
  //       res.json({ mensaje: "Correo enviado con éxito" });
  //     });

  //   } catch (error) {
  //     // res.status(500).json({ error });
  //     res.status(500).json({ error: error.message || "Error desconocido" });
  //   }
  // },
  // // Restablecer contraseña---------------------------------------------------------------------------------------------------------------------
  // restablecerContrasena : async (req, res) => {
  //   const { token } = req.params;
  //   const { Password } = req.body;

  //   try {
  //     const usuario = await Usuarios.findOne({
  //       resetPasswordToken: token,
  //       resetPasswordExpires: { $gt: Date.now() },
  //     });

  //     if (!usuario) {
  //       return res.status(400).json({ mensaje: "Token inválido o ha expirado" });
  //     }

  //     // Actualizar la contraseña del usuario
  //     const salt = bcryptjs.genSaltSync(10);
  //     usuario.Password = bcryptjs.hashSync(Password, salt);

  //     // Limpiar los campos de reset password
  //     usuario.resetPasswordToken = undefined;
  //     usuario.resetPasswordExpires = undefined;

  //     await usuario.save();

  //     res.json({ mensaje: "Contraseña restablecida correctamente" });
  //   } catch (error) {
  //     res.status(500).json({ error });
  //   }
  // }
};

module.exports = { httpUsarios };
