const Sale = require("../models/Sale.model");
const Cart = require("../models/Cart.model");
const { removeDuplicates } = require('../helpers/removeDuplicates')
const mailer = require('../config/mailer.config');
const User = require("../models/User.model");
const Supplier = require("../models/Supplier.model");
const createError = require('http-errors');
const Promo = require("../models/Promo.model");
const Stripe = require('stripe')
// Change deploy TODO
const stripe = new Stripe("sk_test_51Ik9zhKuQKvQj70tBPa2XewniUW8yqqnkvspHIh7mXcpOEdFsFDrPGvbclNXFvEWxxzeJPvEZ2r3mElp7YlC7d8300k79gkjYY")

module.exports.sendEmailSale = async (req, res, next) => {
  try {
    console.log(req.body.products)
    const { email, products, address, price } = req.body
    mailer.sendSaleUser(email, products, address, price)
  } catch(e) { next(e) }
}

module.exports.pay = async (req, res, next) => {
  try {
    const { id, amount } = req.body
  
    await stripe.paymentIntents.create({
      amount: amount,
      currency: "EUR",
      description: "Yumi product",
      payment_method: id,
      confirm: true
    })

    await Sale.updateMany({ relatedSales: req.currentCart }, { $set: { paid: true } })
    const salesUpdate = await Sale.updateMany({ relatedSales: req.currentCart }, { $set: { state: 'Preparando' } })

    res.json(salesUpdate)
  } catch(e) {
    /* res.json({ message: e.raw.message }) */
    console.log(e)
  }
}

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
          city: req.body.city,
          street: req.body.street,
          number: req.body.number,
          block: req.body.block,
          zip: req.body.zip,
        }
      })
      const supp = await Supplier.findById(suppliersFiltered[i])

      mailer.sendSaleSupplier(supp.email, saleProducts, salePrice, `${req.body.street}, ${req.body.number}, ${req.body.block}. ${req.body.city}, ${req.body.zip}, `)
      allSales.push(sale)
    }

    // Stripe cobrar todo junto
    let finalPriceTotal = finalPrice.reduce((a,b) => a + b)
    if (req.body.promo) {
      const promo = await Promo.findOne({ code: req.body.promo })
      if (!promo) {
        next(createError(404, 'Código de promoción no encontrado'))
      } else {
        finalPriceTotal -= promo.discount
        if (finalPriceTotal < 0) {
          await Promo.findOneAndUpdate( // NO TE COBRO
            {code: req.body.promo },
            { discount: finalPriceTotal *= -1 },
            { new: true, useFindAndModify: false }
          )
        } else if (finalPriceTotal === 0) {
          await Promo.findOneAndDelete({code: req.body.promo }) // NO TE COBRO
        } else {
          await Promo.findOneAndDelete({code: req.body.promo })// TE COBRO STRIPE
        }

        const user = await User.findById(req.currentUser)
        mailer.sendSaleUser(user.email, cart.products, `${req.body.street}, ${req.body.number}. ${req.body.city}, ${req.body.zip}, `,finalPriceTotal, promo.discount)
        
        res.status(201).json({allSales, toPay: finalPriceTotal })
      }
    } else {
      const user = await User.findById(req.currentUser)
        mailer.sendSaleUser(user.email, cart.products, `${req.body.street}, ${req.body.number}. ${req.body.city}, ${req.body.zip}, `,finalPriceTotal)
        
        res.status(201).json({allSales, toPay: finalPriceTotal, infoMail: {email: user.email, products: cart.products, address: `${req.body.street}, ${req.body.number}. ${req.body.city}, ${req.body.zip}, `, price: finalPriceTotal}})
    }

  } catch(e) { next(e) }
}

module.exports.createPromo = async (req, res, next) => {
  try {
    const promo = await Promo.create({ discount: req.body.discount })
    res.json(promo)
  } catch(e) { next(e) }
}

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
    const sale = await Sale.findById(saleID)
    const user = await User.findById(sale.user)
    const supp = await Supplier.findById(sale.supplier)
    if (req.body.state === 'Cancelado') {
      const promo = await Promo.create({ discount: sale.price })

      mailer.sendEmailUserFromSupp(
        user.email,
        `El puesto ${supp.name} ha ${req.body.state} su pedido`,
        `${req.body.message}. Disculpe las molestias.
        Dispone de un código de promoción por la cantidad de ${sale.price}€ con el código ${promo.code}`
      )
    }
    if (req.body.state === 'Entregado') {
      mailer.sendSaleDone(user.email, supp.name, sale.products, '/home') // jfk: url a review
    }


    const saleEdited = await Sale.findByIdAndUpdate({ _id: saleID }, { state: req.body.state }, { new: true, useFindAndModify: false })
    res.json(saleEdited)
  } catch(e) { next(e) }
}

module.exports.cancelSale = async (req, res, next) => {
  const { saleID } = req.params
  let saleEdited
  try {
    const sale = await Sale.findById(saleID)
    const user = await User.findById(sale.user)
    const supp = await Supplier.findById(sale.supplier)
    if (sale.state === 'Procesando') {
     saleEdited = 'El pedido ha sido cancelado antes del cobro'
    } else if (sale.state !== 'Prerarando') {
      next(createError(404, 'El pedido ha sido enviado'))
    } else {
      const promo = await Promo.create({ discount: sale.price })

        mailer.sendEmailUserFromSupp(
          user.email,
          `Su pedido de ${supp.name} ha sido cancelado`,
          `Su pedido ha sido cancelado.
          Dispone de un código de promoción por la cantidad de ${sale.price}€ con el código ${promo.code}`
        )
      saleEdited = await Sale.findByIdAndUpdate({ _id: saleID }, { state: 'Cancelado' }, { new: true, useFindAndModify: false })
    }
    res.json(saleEdited)

  } catch(e) { next(e) }
}

// Get ventas por user
module.exports.getUserSales = async (req, res, next) => {
  try {
    const allsales = await Sale.find({ user: req.currentUser })
    res.json(allsales)
  } catch(e) { next(e) }
}

