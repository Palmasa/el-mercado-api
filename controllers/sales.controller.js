const Sale = require("../models/Sale.model");
const Cart = require("../models/Cart.model");
const { removeDuplicates } = require('../helpers/removeDuplicates')
const mailer = require('../config/mailer.config');
const User = require("../models/User.model");
const Supplier = require("../models/Supplier.model");

// Create sale
module.exports.create = async (req, res, next) => {
  try {
    const cart = await Cart.findById(req.currentCart)
    let suppliers = []
    cart.products.map((p) => {
      suppliers.push(p.supplierId)
    })
    let suppliersFiltered = removeDuplicates(suppliers)
    let allSales = []
    let finalPrice = [] // lo que se cobra al user

    // encontrar los p de cada uno de los supp y crear una venta por cada supp con sus p
    for (let i = 0; i < suppliersFiltered.length; i++) {
      let saleProducts = cart.products.filter((product) => (product.supplierId).toString() ===  (suppliersFiltered[i]).toString())

      let productsPrice = []
      saleProducts.map((p) => productsPrice.push(p.quantity * p.price))
      let salePrice = (productsPrice.reduce((a, b)=> a + b)) + saleProducts[0].sendPrice
      finalPrice.push(salePrice)

      const sale = await Sale.create({
        user: req.currentUser,
        products: saleProducts,
        price: salePrice,
        supplier: suppliersFiltered[i],
        relatedSales: (cart._id).toString(),
        address: {
          CA: req.body.ccaa,
          province: req.body.province,
          city: req.body.city,
          street: req.body.street,
          number: req.body.number,
          zip: req.body.zip,
        }
      })
      const supp = await Supplier.findById(suppliersFiltered[i])

      mailer.sendSaleSupplier(supp.email, saleProducts, salePrice, `${req.body.street}, ${req.body.number}. ${req.body.city}, ${req.body.zip}, `)
      allSales.push(sale)
    }

    // Stripe cobrar todo junto
    let finalPriceTotal = finalPrice.reduce((a,b) => a + b)

    // STRIPE

    const user = await User.findById(req.currentUser)
    mailer.sendSaleUser(user.email, cart.products, `${req.body.street}, ${req.body.number}. ${req.body.city}, ${req.body.zip}, `,finalPriceTotal)
    
    // await Cart.findByIdAndDelete(req.currentCart)
    res.status(201).json(allSales)
  } catch(e) { next(e) }
}

// hook de stripe. Encontrar todas las sales y -> paid: true

// Get ventas en curso por supplier 
module.exports.getOngoingSales = async (req, res, next) => {
  try {
    const allsales = await Sale.find({ supplier: req.currentUser, state: {$ne: 'Entregado'} })
    res.json(allsales)
  } catch(e) { next(e) }
}

// Get ventas finalizadas
module.exports.getCompletedSales = async (req, res, next) => {
  try {
    const allsales = await Sale.find({ supplier: req.currentUser, state: 'Entregado' })
    res.json(allsales)
  } catch(e) { next(e) }
}

module.exports.changeStateSupp = async (req, res, next) => {
  const { saleID } = req.params
  try {
    if (req.body.state === 'Denegado') {
      mailer.sendEmailUserFromSupp()
    }
    if (req.body.state === 'Entregado') {
      mailer.sendSaleDone()
    }


    const sale = await Sale.findByIdAndUpdate({ _id: saleID }, { state: req.body.state }, { new: true, useFindAndModify: false })
    res.json(sale)
  } catch(e) { next(e) }
}

module.exports.changeStateUsers = async (req, res, next) => {
  const { saleID } = req.params
  try {
    if (req.body.state === 'Cancelado') {
      mailer.sendEmailUserFromSupp()
    }
    if (req.body.state === 'Entregado') {
      mailer.sendSaleDone()
    }


    const sale = await Sale.findByIdAndUpdate({ _id: saleID }, { state: req.body.state }, { new: true, useFindAndModify: false })
    res.json(sale)
  } catch(e) { next(e) }
}

// Get ventas por user
module.exports.getUserSales = async (req, res, next) => {
  try {
    const allsales = await Sale.find({ user: req.currentUser })
    res.json(allsales)
  } catch(e) { next(e) }
}

