const mongoose = require('mongoose')
const createError = require('http-errors');
const Cart = require('../models/Cart.model')
const Product = require('../models/Product.model');
const Supplier = require('../models/Supplier.model');
const Shipping = require('../models/Shipping.model');
// hacer calculos de el coste de envio por supplier
module.exports.create = async (req, res, next) => {
  let cart, newCart
  const { productId } = req.params
  try {
    if (!req.currentZip) {
      next(createError(404, 'Se necesita el cp'))
    } else {

      const product = await Product.findById(productId)
      const supp = await Supplier.findById(product.supplier)
      const ship = await Shipping.findById(product.shipping)
      let okToSend = ship.shipping.some((el) => el.province === req.currentZip)
 
      if (!okToSend) {
        next(createError(404, 'Este producto no llega a su provincia'))
      } else {

        let shipPrice = ship.shipping.filter((el) => el.province === req.currentZip)

        if (!req.currentCart) { //----------------------- create cart

          if (req.currentUser) {
            req.body.user = req.currentUser
          }
          req.body.products = [{
            product: product._id,
            name: product.name,
            price: product.price,
            img: product.img[0],
            supplier: supp.name,
            supplierId: supp._id,
            quantity: 1,
            sendPrice: shipPrice[0].sendPrice,
          }]
          req.body.total = shipPrice[0].sendPrice + product.price
          cart = await Cart.create(req.body) 
          newCart = true
  
        } else { //--------------------------------------- addItem
        
          newCart = false
          const oldCart = await Cart.findById(req.currentCart)
          
          let cartHasProduct = oldCart.products.some((el) => (el.product).toString() === (product._id).toString())

          if (cartHasProduct) { // ----------------------- add quantity

            oldCart.products.forEach((p) => {
              if ((p.product).toString() === (product._id).toString()) {
                p.quantity += 1
              }
            })
            oldCart.total += product.price
            cart = await Cart.findOneAndUpdate({ _id: oldCart._id}, oldCart,{ new: true, useFindAndModify: false })

          } else { // ------------------------------------- add a product to cart
            
            let cartHasSameSupp = oldCart.products.some((el) => (el.supplierId).toString() === (supp._id).toString())
            if (cartHasSameSupp) {
              oldCart.total += product.price
            } else {
              oldCart.total = product.price + ship.sendPrice + oldCart.total
            }

            oldCart.products.push({
              product: product._id,
              name: product.name,
              price: product.price,
              img: product.img[0],
              supplier: supp.name,
              supplierId: supp._id,
              quantity: 1,
              sendPrice: shipPrice[0].sendPrice,
            })
            cart = await Cart.findOneAndUpdate({ _id: oldCart._id}, oldCart,{ new: true, useFindAndModify: false })
          }
        }
      }
  
      res.status(201).json({cart, newCart}).end() 
    }
  } catch(e) { next(e) }
}


module.exports.deleteItem = async (req, res, next) => {
  const { productId } = req.params
  try {
    let newCart = await Cart.findById(req.currentCart)
    let q 
    if (newCart.products.length !== 0) { // codigo spaguetti
      q = (newCart.products.filter((p) => (p.product).toString() === (productId).toString()))[0].quantity
    }
    newCart.products = newCart.products.filter((p) => (p.product).toString() !== (productId).toString())
    
    if (newCart.products.length === 0) {
      await Cart.findByIdAndDelete(req.currentCart)
      newCart = 'Carrito eliminado'
    } else {
      const product = await Product.findById(productId)
      const supp = await Supplier.findById(product.supplier)
      const ship = await Shipping.findById(product.shipping)

      let cartHasSameSupp = newCart.products.some((el) => (el.supplierId).toString() === (supp._id).toString())
      
      
      if (cartHasSameSupp) {
        newCart.total = newCart.total - (product.price * q)
      } else {
        newCart.total = newCart.total - (product.price * q) - ship.sendPrice
      }
    }

    await Cart.findOneAndUpdate({ _id: req.currentCart}, newCart,{ new: true, useFindAndModify: false })
    res.json(newCart)

  } catch(e) { next(e) }

}

module.exports.adjustQ = async (req, res, next) => {
  const { productId, operator } = req.params

  try {
    let newCart = await Cart.findById(req.currentCart)
    const product = await Product.findById(productId)
    const supp = await Supplier.findById(product.supplier)
    const ship = await Shipping.findById(product.shipping)

    if (operator === "add") {
      newCart.products.forEach((p) => {
        if ((p.product).toString() === (productId).toString()) {
          p.quantity += 1
        }
      })
      let cartHasSameSupp = newCart.products.some((el) => (el.supplierId).toString() === (supp._id).toString())
      
      if (cartHasSameSupp) {
        newCart.total = newCart.total + product.price
      } else {
        newCart.total = newCart.total + product.price + ship.sendPrice
      }
    } else {
      let hasMoreThanOne = newCart.products.some((el) => el.quantity > 1)
 
      if (hasMoreThanOne) {
        newCart.products.forEach((p) => {
          if ((p.product).toString() === (productId).toString()) {
              p.quantity -= 1
          }
        })
        let cartHasSameSupp = newCart.products.some((el) => (el.supplierId).toString() === (supp._id).toString())
        
        if (cartHasSameSupp) {
          newCart.total = newCart.total - product.price
        } else {
          newCart.total = newCart.total - product.price - ship.sendPrice
        }
      }
    }

    await Cart.findOneAndUpdate({ _id: req.currentCart}, newCart,{ new: true, useFindAndModify: false })
    res.json(newCart)

  } catch(e) { next(e) }
}

module.exports.delete = async (req, res, next) => {
  try {
    await Cart.findByIdAndDelete(req.currentCart)
    res.json({message: "El carrito ha sido eliminado"})
  } catch(e) { next(e) }
}

