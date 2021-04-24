const Sale = require("../models/Sale.model");
const Cart = require("../models/Cart.model");
const { removeDuplicates } = require('../helpers/removeDuplicates')

// Create sale
module.exports.createSale = async (req, res, next) => {
  try {
    const cart = await Cart.findById(req.currentCart)
    let suppliers = []
    cart.products.map((p) => {
      suppliers.push(p.supplierId)
    })
    let suppliersFiltered = removeDuplicates(suppliers)
    // encontrar los productos de cada uno de los suppliers y crear una venta por cada supplier con sus productos
    suppliersFiltered.forEach((supp) => {
      
    })
    
    // stripe cobrar todo junto


    const sale = await Sale.create(req.body)
    res.status(201).json(sale)
  } catch(e) { next(e) }
}

// Edit State sale

// Payed sales

// Get USER sales

// Get SUPPLIER sales