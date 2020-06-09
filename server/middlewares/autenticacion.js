const jwt = require('jsonwebtoken')

// ===============
// Verificar token
// ===============

let verificaToken = (req, res, next) => { // next continuará con la ejecución del programa. Si no llamamos a next sólo imprimirá el token y no hará lo que tiene el get

    // Leemos el header personalizado
    let token = req.get('token');

    // En vez de usar bcrypt.compareSync usarmos mejor esta función
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            })
        }

        // En decoded tendremos la información del usuario, por lo que se lo pasaremos en la request
        req.usuario = decoded.usuario;

        // Lo ejecutamos aquí para que sólo se ejecute lo siguiente si el usuario es correcto. Si no lo es, se parará en el punto anterior y devolverá el error
        next();
    })

    /*res.json({
        token: token
    });*/

};

// ==================
// Verifica AdminRole
// ==================
let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role !== 'ADMIN_ROLE') {
        return res.status(403).json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        })
    }

    next();

}

module.exports = {
    verificaToken,
    verificaAdmin_Role
}