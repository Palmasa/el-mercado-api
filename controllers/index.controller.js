const Product = require("../models/Product.model");
const Sale = require("../models/Sale.model");


// example controller, delete
module.exports.index = (req, res, next) => {
  res.send('El mercado API. Send me a request')
};

module.exports.products = async (req, res, next) => {
  try { 
    const listProducts = await Product.find()
    res.json(listProducts)
  } catch(e) { next(e) }
}


module.exports.createSale = async (req, res, next) => {
  try {
    const sale = await Sale.create(req.body)
    res.status(201).json(sale)
  } catch(e) { next(e) }
}