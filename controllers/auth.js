const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async (req, res = response) => {

    const { email, password, password2, name } = req.body;

    try {

        let usuario = await Usuario.findOne({ email });

        if (usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario existe con ese correo'
            });
        }

        usuario = new Usuario(req.body);

        // Verificar nombre
        if (name.length <= 1) {
            return res.status(400).json({
                ok: false,
                msg: 'El nombre debe tener al menos 2 caracteres'
            });
            
        }

        // Verificar contraseñas
        if (password !== password2) {
            return res.status(400).json({
                ok: false,
                msg: 'Las contraseñas no coinciden'
            });
        }

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();

        // Genera JWT
        const token = await generarJWT(usuario.id, usuario.name);

        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor contacte con el administrador',
        });
    }

}

const loginUsuario = async (req, res = response) => {

    const { email, password } = req.body;

    try {
        const usuario = await Usuario.findOne({ email });

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe con ese email'
            });
        }

        // Confirmar las constraseñas
        const validPassword = bcrypt.compareSync(password, usuario.password);

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña no es correcta'
            });
        }

        // Generar JWT
        const token = await generarJWT(usuario.id, usuario.name);

        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor contacte con el administrador',
        });
    }



}


const revalidarToken = async (req, res = response) => {

    const { uid, name } = req;

    // Generar un nuevo JWT y retornarlo en petición
    const token = await generarJWT(uid, name);

    res.json({
        ok: true,
        uid, name,
        token,
    });
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}