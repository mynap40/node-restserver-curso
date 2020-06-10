require('./config/config')


const express = require('express')
const mongoose = require('mongoose')
    // Path no hay que instalarla, viene por defecto
const path = require('path')

const app = express()
const bodyParser = require('body-parser')



// parse application/x-www-form-urlencoded
// app.use son también midlewares, que se ejecutarán cada ver que hagamos una petición
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')))


// Configuración global de rutas
app.use(require('./routes/index'));

// Añado { useNewUrlParser: true, useCreateIndex: true }, para que desaparezca el warning de deprecated
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true }, (err, req) => {
    if (err) throw err;

    console.log('Base de datos ONLINE')
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto:', process.env.PORT)
})