const Product = require("../models/Product.model");

// Get all products
module.exports.products = async (req, res, next) => {
  const criteria = {}
  const { category, search } = req.query

  if (search) {
    criteria.name = new RegExp(search, 'i')
  }

  if (category) {
    criteria.categories = { '$in': [category] }
  }
  
  try { 
    const listProducts = await Product.find(criteria)
    res.json(listProducts)
  } catch(e) { next(e) }
}

// Create product
module.exports.create = async (req, res, next) => {
  try {
    const newProduct = await Product.create(req.body)
    res.json(newProduct)
  } catch(e) { next(e) }
}

// Edit product ++Boost product

// Delete product