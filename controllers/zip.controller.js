const { provinces } = require("../constants/ccaa")
const { zipFinder } = require("../helpers/zipFinder")
const createError = require('http-errors')
const Cart = require('../models/Cart.model')
const Product = require('../models/Product.model');
const Shipping = require("../models/Shipping.model");
const {removeDuplicates} = require('../helpers/removeDuplicates')

module.exports.zip = async (req, res, next) => {
  const { zip } = req.body

  const zDec = zipFinder(zip, next) // descifro aquí

  if (!provinces.includes(zDec)) {
    next(createError(404, 'El código postal debe corresponder al territorio nacional'))
  } else {
    if (!req.currentCart) {

      res.json({ zip, zDec }) // a local S en front

    } else {

      let currentCart = await Cart.findById(req.currentCart)
      let productsInCart = []
      currentCart.products.map((p) => {
        productsInCart.push(p.product)
      })
      const promises = productsInCart.map((prod) => Product.findById(prod))
      const allProductsInCart = await Promise.all( promises )
      const promisesShipping = allProductsInCart.map((prod) => Shipping.findById(prod.shipping))
      const allShippingsInCart = await Promise.all( promisesShipping )
      const okItems = []
      const deletedItems = []
      currentCart.products.map((prod, i) => {
        let okToSend = allShippingsInCart[i].shipping.some((el) => el.province === zDec)
        if (okToSend) {
          okItems.push(prod)
        } else {
          deletedItems.push(prod)
        }
      })

      if (deletedItems.length === 0) {
        res.json({ zip, zDec, message: 'Todos los productos de su bolsa llegan al nuevo código postal proporcionado' })
      } else if (okItems.length === 0) {
        res.json({ zip, zDec, message: 'Su cesta ha sido eliminada' })
      } else { // A partir de aquí no probado en el front por falta de productos

        currentCart.products = okItems
        
        // Precio sin envio
        let onlypricesandQ = []
        currentCart.products.map((p) => onlypricesandQ.push(p.price * p.quantity))

        currentCart.total = onlypricesandQ.reduce((a , b) =>  a + b)

        //precio con envio - NO TE COBRO ENCVIO
        /* let allSupp = []
        currentCart.products.map((p) => allSupp.push(p.supplierId))
        let uniqueSupp = removeDuplicates(allSupp)
        console.log(uniqueSupp)
        let allPrices = []
        for (let i = 0; i <= uniqueSupp.length; i++) {
          const eachPrice = currentCart.products.find((el) => el.supplierId.toString() === uniqueSupp[i].toString())
          allPrices.push(eachPrice.sendPrice)
        }
        currentCart.total += allPrices.reduce((a, b) => a + b) */
  
        const cartUpdated = await Cart.findOneAndUpdate({ _id: req.currentCart}, currentCart,{ new: true, useFindAndModify: false })
        res.json({ zip, zDec, cartUpdated, deletedItems })
      }
    }
  }
}


module.exports.get = (req, res, next) => {
  try {
    res.json(req.currentZip)
  } catch(e) { next(e) }
}
