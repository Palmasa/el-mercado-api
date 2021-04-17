const Product = require("../models/Product.model");

// Get all products
module.exports.products = async (req, res, next) => {
  try { 
    const listProducts = await Product.find()
    res.json(listProducts)
  } catch(e) { next(e) }
}

// Create product

// Edit product ++Boost product

// Delete product