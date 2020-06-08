const express = require('express')
const app = express()
const Usuario = require('../models/usuario');
// Para encriptar la contraseña con un hash de un único lado
const bcrypt = require('bcrypt');
// Es una librería que extiende muchas cosas funcionalidades que Javascript tendría que tener por defecto. Lo usaremos para eliminar campos del objecto body a la hora de actualizar con PUT.
const _ = require('underscore')

app.get('/usuario', function(req, res) {

    let desde = req.query.desde || 0; // Si viene el parámetro desde lo uso y si no busco desde la página 0
    desde = Number(desde); // Lo transformamos en número

    let limite = req.query.limite || 5;
    limite = Number(limite)

    // Me devuelve todos
    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde) // Desde qué registro
        .limit(limite) // El límite de registros
        .exec((err, usuarios) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });

            })

        })
});

app.post('/usuario', function(req, res) {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    })


    // Lo grabamos en BD
    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })


    })

    /*if (body.nombre === undefined) {

        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario'
        });

    } else {
        res.json({
            persona: body
        })
    }*/

});

app.put('/usuario/:id', function(req, res) {
    let id = req.params.id; // params.id === :id

    // Sólo nos quedamos con los campos que sí se deberían actualizar.
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    // Así nos devuelve el usuario antes de la actualización
    //Usuario.findByIdAndUpdate(id, body, (err, usuarioDB) => {
    // Asi nos devuelve el usuario con la modificación y con las validaciones que le hayamos puesto en el esquema
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true, //por defecto devuelve estatus 200
            usuario: usuarioDB
        })

    })


});

app.delete('/usuario/:id', function(req, res) {
    let id = req.params.id;

    //    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    let cambiaEstado = {
        estado: false
    }

    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        };

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            })
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });

    });
});

module.exports = app;