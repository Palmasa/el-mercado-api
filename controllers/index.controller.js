const { menu } = require("../constants/menu");
const { productCategs } = require("../constants/productCategs");
const { supplierCategs } = require("../constants/supplierCategs");

// example controller, delete
module.exports.index = (req, res, next) => {
  res.send('El mercado API. Send me a request')
};

module.exports.categs = (req, res, next) => {
  res.json(supplierCategs)
}

module.exports.productCategs = (req, res, next) => {
  res.json(productCategs)
}

module.exports.menuCategs = (req, res, next) => {
  res.json(menu)
}