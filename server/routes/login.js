const express = require('express')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const Usuario = require('../models/usuario');
const app = express()



app.post('/login', (req, res) => {

    let body = req.body;

    // Verificamos si el correo existe
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                message: '(Usuario) o contraseña incorrectos'
            });

        }

        // Comprobamos si al encriptar la contraseña que nos envía el usuario coincide con la que tenemos guardada en BD. Para ello usamos la función compareSync
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                message: 'Usuario o (contraseña) incorrectos'
            });

        }

        let token = jwt.sign({
                usuario: usuarioDB
            }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN }) // QUe expire en 30 días

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });

    })

});



module.exports = app;