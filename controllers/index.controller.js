const Product = require("../models/Product.model");


// example controller, delete
module.exports.index = (req, res, next) => {
  res.send('El mercado API. Send me a request')
};

module.exports.products = async (req, res, next) => {
  const listProducts = await Product.find()
  try { res.json(listProducts) }
  catch { next }
}
