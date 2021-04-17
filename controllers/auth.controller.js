const createError = require('http-errors')
const jwt = require('jsonwebtoken')
const User = require("../models/User.model")
const Supplier = require("../models/Supplier.model")
const mailer = require('../config/mailer.config')

module.exports.registration = async (req, res, next) => {
  const { email } = req.body

  const user = await Promise.all([User.findOne({ email }), Supplier.findOne({ email })])

  if (user[0] || user[1]) {
    next(createError(400, { errors: { email: 'Este email ya está registrado' }}))
  } else {
    const userCreated = await User.create(req.body)
    
    try {
      mailer.sendActivationEmail(userCreated.email, userCreated.token)
      res.status(201).json({ message: "Usuario registrado"}) //JFK: why do I have to return an emty object for Postman to stop? it works either way but Postman, ay postman
    } catch (e) {
      if (e instanceof mongoose.Error.ValidationError) {
        next(createError(401, { errors: { email: 'Intente registrarse de nuevo' }}))
      } else {
        next(e)
      }
    }
  }
}

module.exports.activate = async (req, res, next) => {
  const { token } = req.params
  // JFK: Not sure if line 34 goes in the try or here works either way
  try {
    await User.findOneAndUpdate({ token: token }, { active: true }, { useFindAndModify: false })
    res.status(201).json({ message: "Usuario activado" }) // JFK '' line 19
  } catch(e) {
    next(e)
  }
}
// TODO: PONER QUE SOLO LOS ACTIVES PUEDEN LOGUEARSE
module.exports.login = async (req, res, next) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (!user) {
    // Error if no user
    next(createError(404, { errors: { email: 'Email o contraseña incorrectos' }})) // error es de mongoose
  } else {
    const match = user.checkPassword(password)
    if (!match) {
      //Error if no password
      next(createError(404, { errors: { email: 'Email o contraseña incorrectos' }}))
    } else {
      // JWT generation - only id is passed
      res.json({ 
        access_token: jwt.sign(
          { id: user._id },
          process.env.JWT_SECRET || 'changeme',
          {
            expiresIn: '1d'
          }
        )
      })
    }
  }
}

module.exports.get = (req, res, next) => {
  User.findById(req.currentUser) // aquñí es donde está el id del que me viene con el token
    .then(user => {
      if (!user) {
        next(createError(404))
      } else {
        res.json(user)
      }
    })
}
