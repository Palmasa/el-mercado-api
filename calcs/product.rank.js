const Product = require("../models/Product.model")


module.exports.rank = async (req, res, next) => {
  try {
    const total = await Product.find()
    return total.length += 1
  } catch(e) {
    next(e)
  }
}