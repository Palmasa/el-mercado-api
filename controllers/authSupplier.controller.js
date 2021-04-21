const createError = require('http-errors')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require("../models/User.model")
const Supplier = require("../models/Supplier.model")
const mailer = require('../config/mailer.config')
const { slugGeneratorSupplier } = require("../helpers/slug.generator")

module.exports.registrationSupplier = async (req, res, next) => {
  const { email } = req.body

  const user = await Promise.all([User.findOne({ email }), Supplier.findOne({ email })])

  if (user[0] || user[1]) {
    user[0]
    ? next(createError(400, { errors: { email: 'Este email ya está registrado como usuario' }}))
    : next(createError(400, { errors: { email: 'Email registrado como vendedor' }}))
  } else {
    try {

      req.body.slug = slugGeneratorSupplier(req.body.name, req.body.categ)

      const supplierCreated = await Supplier.create(req.body)
      mailer.sendActivationEmailSupplier(supplierCreated.email, supplierCreated.token)
      res.status(201).json({ message: "Vendedor registrado"})
    } catch(e) {
      if (e instanceof mongoose.Error.ValidationError) {
        next(createError(401, { errors: { email: 'Email inválido', password: 'Contraseña inválida', CIF: 'CIF inválido', categ: 'Categoría inválida', name: 'Nombre requerido', type: 'Modelo de comercio requerido'}}))
      } else {
        next(e)
      }
    }
  }
}

module.exports.activateSupplier = async (req, res, next) => {
  const { token } = req.params

  try {
    const user = await Supplier.findOneAndUpdate({ token }, { active: true }, { new: true, useFindAndModify: false })
    if (user) {
      res.status(201).json({ message: "Venedor activado" })
    } else {
      next(createError(404))
    }
  } catch(e) {
    next(e)
  }
}

module.exports.loginSupplier = async (req, res, next) => {
  const { email, password } = req.body

  const supplier = await Supplier.findOne({ email })

  if (!supplier) {
    next(createError(404, { errors: { email: 'Email o contraseña incorrectos' }})) // error es de mongoose
  } else {
    const match = await supplier.checkPassword(password)
    if (!match) {
      next(createError(404, { errors: { email: 'Email o contraseña incorrectos' }}))
    } else if (match && !supplier.active) {
      next(createError(404, { errors: { email: 'Su cuenta no está activa, por favor revise su email' }}))
    } else {
      res.json({ 
        access_token: jwt.sign(
          { id: supplier._id },
          process.env.JWT_SECRET || 'changeme',
          {
            expiresIn: '1d'
          }
        )
      })
    }
  }
}

module.exports.getSupplier = async (req, res, next) => {
  const supplier = await Supplier.findById(req.currentUser) // id del token introducido por auth.middleware
  if (!supplier) {
    next(createError(404))
  } else {
    res.json(supplier)
  }
}