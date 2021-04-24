const createError = require('http-errors')
const jwt = require('jsonwebtoken')
const User = require("../models/User.model")
const Supplier = require("../models/Supplier.model")
const Cart = require("../models/Cart.model")
const mailer = require('../config/mailer.config')
const { zipFinder } = require('../helpers/zipFinder')

module.exports.registration = async (req, res, next) => {
  const { email } = req.body

  const user = await Promise.all([User.findOne({ email }), Supplier.findOne({ email })])

  if (user[0] || user[1]) {
    user[0]
    ? next(createError(400, { errors: { email: 'Este email ya está registrado' }}))
    : next(createError(400, { errors: { email: 'Email registrado como vendedor' }}))
  } else {
    try {
      const userCreated = await User.create(req.body)
      mailer.sendActivationEmail(userCreated.email, userCreated.token)
      res.status(201).json({ message: "Usuario registrado"})
    } catch (e) {
      if (e instanceof mongoose.Error.ValidationError) {
        next(createError(401, { errors: { email: 'Email inválido', password: 'Contraseña inválida' }}))
      } else {
        next(e)
      }
    }
  }
}

module.exports.activate = async (req, res, next) => {
  const { token } = req.params

  try {
    const user = await User.findOneAndUpdate({ token }, { active: true }, { new: true, useFindAndModify: false })
    if (user) {
      res.status(201).json({ message: "Usuario activado" })
    } else {
      next(createError(404))
    }
  } catch(e) {
    next(e)
  }
}

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (!user) {
    next(createError(404, { errors: { email: 'Email o contraseña incorrectos' }})) // error es de mongoose
  } else {
    const match = await user.checkPassword(password)
    if (!match) {
      next(createError(404, { errors: { email: 'Email o contraseña incorrectos' }}))
    } else if (match && !user.active) {
      next(createError(404, { errors: { email: 'Su cuenta no está activa, por favor revise su email' }}))
    } else {
      
      let cart, zip
      const hasCart = await Cart.findOne({ user: user._id })
      if (hasCart) { cart = hasCart._id } 
      if (user.address.zip) { zip = zipFinder(user.address.zip)}

      res.json({ 
        access_token: jwt.sign(
          { id: user._id },
          process.env.JWT_SECRET || 'changeme',
          {
            expiresIn: '1d'
          }
        ),
        zDec: zip,
        cart
      }
      )
    }
  }
}

module.exports.get = async (req, res, next) => {
  const user = await User.findById(req.currentUser) // id del token introducido por auth.middleware
  if (!user) {
    next(createError(404))
  } else {
    res.json(user)
  }
}