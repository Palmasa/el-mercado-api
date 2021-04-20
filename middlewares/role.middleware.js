const createError = require('http-errors')
const Supplier = require('../models/Supplier.model')
const User = require('../models/User.model')

module.exports.isSupplier = async (req, res, next) => {
  try {
    const supplier = await Supplier.findById(req.currentUser)
    if (!supplier) {
      next(createError(403))
    } else {
      next()
    }
  } catch(e) {
    next(e)
  }

}

module.exports.isUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.currentUser)
    if (!user) {
      next(createError(403))
    } else {
      next()
    }
  } catch(e) {
    next(e)
  }
}