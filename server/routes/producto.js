const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion')

let app = express();
let Producto = require('../models/producto');

// ===========================
// Obtener todos los productos
// ===========================
app.get('/productos', verificaToken, (req, res) => {
    // trae todos los productos
    // populate: usuario categoria
    //paginado
    let desde = req.query.desde || 0; // Si viene el parámetro desde lo uso y si no busco desde la página 0
    desde = Number(desde); // Lo transformamos en número

    //let limite = req.query.limite || 5;
    //limite = Number(limite)


    Producto.find({ disponible: true })
        .skip(desde) // Desde qué registro
        .limit(5) // El límite de registros
        // Para ordenarlo
        //.sort('descripcion')
        // Con populate coge el objectId que estamos cargando y muestra su información. Como tengo objectId del usuario, me mostrará la información del usuario
        .populate('usuario', 'nombre email')
        // Si hubiera más objectId podemos poner más líneas populate
        //.populate('objectId','campos')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            //            Categoria.count((err, conteo) => {
            res.json({
                ok: true,
                productos //,
                //cuantas: conteo
            });

            //})

        });

});

// ==========================
// Obtener un producto por ID
// ==========================
app.get('/productos/:id', verificaToken, (req, res) => {
    // populate: usuario categoria
    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        // Si hubiera más objectId podemos poner más líneas populate
        //.populate('objectId','campos')
        .populate('categoria', 'nombre')
        .exec((err, productoBD) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoBD) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El ID del producto no es correcto'
                    }
                });
            }


            res.json({
                ok: true,
                producto: productoBD
            });

        })
});

// ==========================
// Buscar productos
// ==========================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    // Para hacer las búsquedas flexibles, utilizo las expresiones regulares
    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            })
        })

})

// ==========================
// Crear un nuevo producto
// ==========================
app.post('/productos', verificaToken, (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado

    let body = req.body;

    let producto = new Producto({
        usuario: req.usuario._id,
        categoria: body.categoria, // req.categoria._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // Compruebo si se creo la categoria
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        })

    })
});

// ==========================
// Actualizar un producto
// ==========================
app.put('/productos/:id', verificaToken, (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado

    let id = req.params.id;
    let body = req.body;

    // Compruebo que existe el producto. Si no existe no hago nada
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // Compruebo si se creo la categoria
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        }

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;

        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoGuardado
            })
        })
    })

    /*let infoProducto = {
        usuario: req.usuario._id,
        categoria: body.categoria
    }

    Producto.findByIdAndUpdate(id, infoProducto, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // Compruebo si se creo la categoria
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        })

    })*/

});

// ==========================
// Borrar un producto
// ==========================
app.delete('/productos/:id', verificaToken, (req, res) => {
    // disponible = false
    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        };

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            })
        };

        productoDB.disponible = false;

        productoDB.save((err, productoBorrado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            };

            res.json({
                ok: true,
                producto: productoBorrado,
                message: 'Producto Borrado'
            })
        })

    })

});


module.exports = app;