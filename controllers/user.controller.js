const createError = require('http-errors');
const User = require('../models/User.model');
const mailer = require('../config/mailer.config')

module.exports.edit = async (req, res, next) => {

  req.body.address = {
    country: 'España',
    CA: req.body.ccaa,
    province: req.body.province,
    city: req.body.city,
    street: req.body.street,
    number: req.body.number,
    zip: req.body.zip,
  }

  try {
    const user = await User.findByIdAndUpdate(req.currentUser, req.body, { new: true, useFindAndModify: false })
    if (!user) {
      next(createError(404, 'Usuario no encontrado'))
    } else {
      res.json(user)
    }
  } catch(e) { next(e) }
}

module.exports.changeEmail = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.currentUser, { active: false, email: req.body.newEmail }, { new: true, useFindAndModify: false })
    mailer.sendChangeEmail(req.body.newEmail, user.token)

    res.json({ message: `Se ha enviado un email de confirmación a ${req.body.newEmail}`})
  } catch(e) { next(e) }
}

module.exports.activateNewEmail = async (req, res, next) => {
  const { token } = req.params
  try {
    const userf = await User.find({ token })
    if (!userf) {
      next(createError(404, 'Usuario no encontrado'))
    } else {
      const user = await User.findOneAndUpdate( { token }, { active: true }, { new: true, useFindAndModify: false })
      res.json(user)
    }
  } catch(e) { next(e) }
}

module.exports.changePassword = async (req, res, next) => {
  try {
    const user = await User.findOneAndUpdate({ _id: req.currentUser}, { active: false, password: req.body.newPassword }, { new: true, useFindAndModify: false })
    mailer.sendChangePassword(user.email, user.token)

    res.json({ message: `Le hemos enviado un email para confirmar su identidad`})
  } catch(e) { next(e) }
}

module.exports.activateNewPassword = async (req, res, next) => {
  const { token } = req.params
  try {
    const userf = await User.find({ token })
    if (!userf) {
      next(createError(404, 'Usuario no encontrado'))
    } else {
      const user = await User.findOneAndUpdate( { token }, { active: true }, { new: true, useFindAndModify: false })
      res.json(user)
    }
  } catch(e) { next(e) }
}

module.exports.delete = async (req, res, next) => { 

  try {
    const toDelete = await User.findByIdAndDelete(req.currentUser)
    res.status(200).json({ message: `${toDelete.name}, su cuenta ha sido eliminada`})
  } catch(e) {
    next(e)
  }

}



