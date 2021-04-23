const Supplier = require("../models/Supplier.model")
const createError = require('http-errors');

// Get all suppliers
module.exports.getAll = async (req, res, next) => {
  const criteria = {}
  const { categ, search } = req.query
  if (search) criteria.name = new RegExp(search, 'i')
  if (categ) criteria.categ = { '$in': [categ] }

  try { 
    const listSuppliers = await Supplier.find(criteria)
    res.json(listSuppliers)
  }
  catch { next }
}

module.exports.getOne = async (req, res, next) => {
  try {
    const supplier = await Supplier.findOne({ slug: req.params.slug, active: true })
    if (!supplier) {
      next(createError(404, 'Vendedor no encontrado'))
    } else {
      res.json(supplier)
    }
  } catch(e) {
    next(e)
  }
}

// Edit: Name, categ, type, imgs, logo, bio, address, certificates, owner (name, bio, img)
module.exports.editProfile = async (req, res, next) => {
  req.body.owner = {
    bio: req.body.ownerBio,
    name: req.body.ownerName,
  }
  
  if (req.files) {
    if (req.files.imgs) {
      const arrImgs = []
      req.files.imgs.map(file => arrImgs.push(file.path))
      req.body.imgs = arrImgs
    }
    if (req.files.logo) {
      const strLogo = req.files.logo[0].path
      req.body.logo = strLogo
    }
    if (req.files.ownerImg) {
      const arrImgs = req.files.ownerImg[0].path
      req.body.owner = {
        bio: req.body.ownerBio,
        name: req.body.ownerName,
        img: arrImgs,
      }
    }
  }

  req.body.address = {
    CA: req.body.ccaa,
    province: req.body.province,
    city: req.body.city,
    street: req.body.street,
    number: req.body.number,
    zip: req.body.zip,
  }
  
  try {
    const supp = await Supplier.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true, useFindAndModify: false }
    )
      res.status(201).json(supp)
  } catch(e) {
    next(e)
  }
}

module.exports.changeEmail = async (req, res, next) => {
  try {
    const supp = await Supplier.findByIdAndUpdate(req.currentUser, { active: false, email: req.body.newEmail }, { new: true, useFindAndModify: false })
    mailer.sendChangeEmail(req.body.newEmail, supp.token)

    res.json({ message: `Se ha enviado un email de confirmación a ${req.body.newEmail}`})
  } catch(e) { next(e) }
}

module.exports.activateNewEmail = async (req, res, next) => {
  const { token } = req.params
  try {
    const suppf = await Supplier.find({ token })
    if (!suppf) {
      next(createError(404, 'Vendedor no encontrado'))
    } else {
      const supp = await Supplier.findOneAndUpdate( { token }, { active: true }, { new: true, useFindAndModify: false })
      res.json(supp)
    }
  } catch(e) { next(e) }
}

module.exports.changePassword = async (req, res, next) => {
  try {
    const supp = await Supplier.findOneAndUpdate({ _id: req.currentUser}, { active: false, password: req.body.newPassword }, { new: true, useFindAndModify: false })
    mailer.sendChangePassword(supp.email, supp.token)

    res.json({ message: `Le hemos enviado un email para confirmar su identidad`})
  } catch(e) { next(e) }
}

module.exports.activateNewPassword = async (req, res, next) => {
  const { token } = req.params
  try {
    const suppf = await Supplier.find({ token })
    if (!suppf) {
      next(createError(404, 'Vendedor no encontrado'))
    } else {
      const supp = await Supplier.findOneAndUpdate( { token }, { active: true }, { new: true, useFindAndModify: false })
      res.json(supp)
    }
  } catch(e) { next(e) }
}

module.exports.delete = async (req, res, next) => { 

  try {
    const toDelete = await Supplier.findByIdAndDelete(req.currentUser)
    res.status(200).json({ message: `${toDelete.name}, su cuenta ha sido eliminada`})
  } catch(e) {
    next(e)
  }
}



