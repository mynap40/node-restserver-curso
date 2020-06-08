const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// En {VALUE} inyecta lo que escribe el usuario
let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
}

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

// Imprimimos el esquema. No se usa función de flecha porque necesitamos el this.
// Cuando se imprima con un toJSON le quitamos el campo de password
usuarioSchema.methods.toJSON = function() {
    let user = this;
    // Así tengo todas las propiedades y métodos
    let userObject = user.toObject();
    // Le quito el campo de la contraseña
    delete userObject.password;

    return userObject;
}

usuarioSchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser único'
})

module.exports = mongoose.model('Usuario', usuarioSchema)