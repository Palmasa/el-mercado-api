const { slugGeneratorSupplier } = require("../helpers/slug.generator")
const Supplier = require("../models/Supplier.model")

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

module.exports.create = async (req, res, next) => {
  
  req.body.slug = slugGeneratorSupplier(req.body.name, req.body.categ)
  req.body.shipping = []
}

