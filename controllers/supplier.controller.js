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

// email, password, cif, iban

// supplier delete



