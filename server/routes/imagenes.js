const express = require('express');

const fs = require('fs');
const path = require('path');

const { verificaToken, verificaTokenImg } = require('../middlewares/autenticacion'); // Lo uso para mostrar la imagen sólo si está logueado el usuario

let app = express();

// Para que un usuario pueda ver una imagen sólo si está logueado. :img lo da el frontend

app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;

    // Obtenemos el path de la imagen cargada
    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ img }`)

    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen)
    } else {

        // Obtenemos el path de la imagen no-image
        let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');


        // Lee el content-type y lo devuelve
        res.sendFile(noImagePath);
    }

})


module.exports = app;