const express = require('express');

let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');

// ===============================
// Mostrar todas las categorias
// ===============================
app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find()
        // Para ordenarlo
        .sort('descripcion')
        // Con populate coge el objectId que estamos cargando y muestra su información. Como tengo objectId del usuario, me mostrará la información del usuario
        .populate('usuario', 'nombre email')
        // Si hubiera más objectId podemos poner más líneas populate
        //.populate('objectId','campos')
        .exec((err, categorias) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            //            Categoria.count((err, conteo) => {
            res.json({
                ok: true,
                categorias //,
                //cuantas: conteo
            });

            //})

        });
});

// ===============================
// Mostrar una categoria por ID
// ===============================
app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Categoria.findById(id, (err, categoriaBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaBD) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El ID de categoria no es correcto'
                }
            });
        }


        res.json({
            ok: true,
            categoria: categoriaBD
        });

    })
});

// ===============================
// Crear nueva categoria
// ===============================
app.post('/categoria', verificaToken, (req, res) => {
    // Devuelve la nueva categoria
    // req.usuario._id

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // Compruebo si se creo la categoria
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })

    })
});

// ===============================
// Actualiza la descripción de la categoria
// ===============================
app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    }

    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // Compruebo si se creo la categoria
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })

    })

});

// ===============================
// Borrar la categoria
// ===============================
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    // Solo un administrador puede borrar la categoria
    // Tiene que pedir el token
    // Categoria.findByIdAndRemove
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // Compruebo si se creo la categoria
        if (!categoriaBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Categoria borrada'
        })

    })
});

module.exports = app;