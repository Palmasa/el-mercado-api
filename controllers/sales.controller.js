const Sale = require("../models/Sale.model");

// Create sale
module.exports.createSale = async (req, res, next) => {
  try {
    const sale = await Sale.create(req.body)
    res.status(201).json(sale)
  } catch(e) { next(e) }
}

// Edit State sale

// Payed sales

// Get USER sales

// Get SUPPLIER sales