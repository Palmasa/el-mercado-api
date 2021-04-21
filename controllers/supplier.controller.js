const Supplier = require("../models/Supplier.model")
const createError = require('http-errors');
const mongoose = require('mongoose');

// Get all suppliers
// JFK: ordenar suppliers por volumen de ventas
module.exports.getAll = async (req, res, next) => {
  const criteria = {}
  const { categ, search } = req.query

  if (search) {
    criteria.name = new RegExp(search, 'i')
  }

  if (categ) {
    criteria.categ = { '$in': [categ] }
  }

  criteria.active = true

  try { 
    const listSuppliers = await Supplier.find(criteria).populate('shippings')

    /* if (req.currentZip) {
      listSuppliers.map((supp) => supp.shippings
      .map((ship) => ship.shipping
      .map((prov) => )))
      
      listSuppliers.filter((supp) => supp.shippings)
    } */

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
    /*  const arrFiles = []
    req.files.map(file => arrFiles.push(file.path))
    req.body.imgs = arrFiles */
    console.log(req.files)
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



