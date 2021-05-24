const createError = require('http-errors');
const mongoose = require('mongoose')
const Product = require("../models/Product.model");
const Supplier = require("../models/Supplier.model");
const Shipping = require('../models/Shipping.model');
const { slugGeneratorProduct } = require('../helpers/slug.generator');
const Sale = require('../models/Sale.model');
const { removeDuplicates } = require('../helpers/removeDuplicates');

// Get all products
module.exports.getAll = async (req, res, next) => {
  const criteria = {}
  const { categ, search } = req.query
  if (search) criteria.name = new RegExp(search, 'i')
  if (categ) criteria.categ = { '$in': categ }
  criteria.active = true
  
  try {
    const listProducts = await Product.find(criteria)
    if (req.currentZip) {
      let okToSend 
      let yesSend = [] 
      let noSend = []
      const promises = listProducts.map((prod) => Shipping.findById(prod.shipping))
      const resolvePromises = await Promise.all( promises )
      listProducts.map((prod, i) => {
        okToSend = resolvePromises[i].shipping.some((el) => el.province === req.currentZip)
        if (okToSend) {
          yesSend.push(prod) 
        } else { 
          noSend.push(prod)
        } 
      })
      res.json({yesSend, noSend})
    } else {
      res.json({ listProducts: listProducts })
    }
  } catch(e) { next(e) }
}

// Get one product
module.exports.getOne = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, active: true })
    const supplier = await Supplier.findById(product.supplier)

    if (!product) {
      next(createError(404, 'Producto no encontrado'))
    } else {

      let okToSend
      let shippModel = false
      if (req.currentZip) {
        const ship = await Shipping.findById(product.shipping)
        okToSend = ship.shipping.some((el) => el.province === req.currentZip)
        if (okToSend) {
          shippModel = ship.shipping.find((el) => el.province === req.currentZip)
        }
      }
      
      res.json({product, okToSend, supplier, shippModel})
    }
  } catch(e) {
    next(e)
  }
}

// Create product
module.exports.create = async (req, res, next) => {
  req.body.supplier = req.currentUser
  req.body.slug = slugGeneratorProduct(req.body.name, req.body.categ)
  if (req.files) {
    const arrFiles = []
    req.files.map(file => arrFiles.push(file.path))
    req.body.img = arrFiles
    console.log(arrFiles)
  }
  
  try {
    const optShippings = await Shipping.findOne({ 
      supplier: req.currentUser,
      name: req.body.shippingName
    })
    req.body.shipping = optShippings._id

    try { 
      const newProduct = await Product.create(req.body)
      res.status(201).json(newProduct)
    } catch(e) {
      if (e instanceof mongoose.Error.ValidationError) {
        next(createError(401, { errors: {
          supplier: 'Debe estar autenticado',
          shipping: 'Es necesario un modelo de envío',
          name: 'El nombre del producto es obligatorio',
          bio: 'La descripción del producto es obligatoria',
          categ: 'Debe tener una categoría por lo menos',
          img: 'El producto necesita de una foto',
          measure: 'Se debe indicar la medida del producto',
          stock: 'Debe indicar qué cantidad de producto se encuentra disponible para la venta',
          price: 'Se debe indicar el precio del producto',
          sendTime: 'Se debe indicar el tiempo estimado de entrega'
        }}
        ))
      } else {
        next(e)
      }
      next(e)
    }

  } catch(e){ next(e) }
}

// Edit product
module.exports.update = async (req, res, next) => {
  req.body.supplier = req.currentUser

  if (req.files) {
    const arrFiles = []
    req.files.map(file => arrFiles.push(file.path))
    req.body.img = arrFiles
  }
  
  if (req.body.shippingName) {
    try {
      const optShippings = await Shipping.findOne({ 
        supplier: req.currentUser,
        name: req.body.shippingName
      })
      req.body.shipping = optShippings._id
    } catch(e) { next(e)}
  }

  try {
    
    const product = await Product.findById(req.params.id)
    if (!product) {
      next(createError(403))
    } else if (product.supplier.toString() !== req.currentUser.toString()) {
      next(createError(403))
    } else {
  
      try { 
        const editedProduct = await Product.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true, useFindAndModify: false })
        res.status(201).json(editedProduct)
      } catch(e) {
        if (e instanceof mongoose.Error.ValidationError) {
          next(createError(401, { errors: {
            suuplier: 'Debe estar autenticado',
            name: 'El nombre del producto es obligatorio',
            bio: 'La descripción del producto es obligatoria',
            categ: 'Debe tener una categoría por lo menos',
            img: 'El producto necesita de una foto',
            measure: 'Se debe indicar la medida del producto',
            stock: 'Debe indicar qué cantidad de producto se encuentra disponible para la venta',
            price: 'Se debe indicar el precio del producto',
            sendTime: 'Se debe indicar el tiempo estimado de entrega'
          }}))
        } else {
          next(e)
        }
      }
    }
  } catch(e) {
    next(e)
  }

}

// Desactivate product
module.exports.desactivate = async (req, res, next) => {

  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      next(createError(403))
    } else if (product.supplier.toString() !== req.currentUser.toString()) {
      next(createError(403))
    } else {
      
      try {
        const toDesactivate = await Product.findByIdAndUpdate({ _id: req.params.id }, { active: false }, { new: true, useFindAndModify: false })
        res.status(201).json(toDesactivate)
      } catch(e) {
        next(e)
      }

    }
  } catch(e) {
    next(e)
  }
}
// Reactivate PLAIN
module.exports.reactivatePlain = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      next(createError(403))
    } else if (product.supplier.toString() !== req.currentUser.toString()) {
      next(createError(403))
    } else {
      
      try {
        const toDesactivate = await Product.findByIdAndUpdate({ _id: req.params.id }, { active: true }, { new: true, useFindAndModify: false })
        res.status(201).json(toDesactivate)
      } catch(e) {
        next(e)
      }

    }
  } catch(e) {
    next(e)
  }
}

// Reactivate
module.exports.reactivate = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      next(createError(403))
    } else if (product.supplier.toString() !== req.currentUser.toString()) {
      next(createError(403))
    } else {
      
      try {
        const toDesactivate = await Product.findByIdAndUpdate({ _id: req.params.id }, { active: true, stock: req.body.stock }, { new: true, useFindAndModify: false })
        res.status(201).json(toDesactivate)
      } catch(e) {
        next(e)
      }

    }
  } catch(e) {
    next(e)
  }
}

// Delete product
module.exports.delete = async (req, res, next) => {

  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      next(createError(403))
    } else if (product.supplier.toString() !== req.currentUser.toString()) {
      next(createError(403))
    } else {
      
      try {
        const toDelete = await Product.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: `${toDelete.name} eliminado`})
      } catch(e) {
        next(e)
      }

    }
  } catch(e) {
    next(e)
  }
}

module.exports.boost = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      next(createError(403))
    } else if (product.supplier.toString() !== req.currentUser.toString()) {
      next(createError(403))
    } else {
      
      try {
        const editedProduct = await Product.findByIdAndUpdate(
          { _id: req.params.id },
          {isBoosted: true, boostPayment: req.body.payment, boostStart: Date.now()},
          { new: true, useFindAndModify: false })
        res.status(201).json(editedProduct)
      } catch(e) { next(e) }

    }

   } catch(e) { next(e) }
    
}

module.exports.getBoosted = async (req, res, next) => {
  try {
    const boostedProducts = await Product.find({"boost.isBoosted": true}).sort({ "boost.payment": -1 })
    if (!boostedProducts) {
      next(createError(404, 'No hay productos boosted'))
    } else {
      res.json(boostedProducts)
    }
  } catch(e) { next(e) }
}

//get product per supp
module.exports.getProductsPerSupplier = async (req, res, next) => {
  try {
    console.log(req.currentUser)
    const listProducts = await Product.find({ supplier: req.currentUser}).populate('sales')
    res.json(listProducts)
  } catch(e) { next(e) }
}

// Get to recommend same supp
module.exports.getRecommendSupplier = async (req, res, next) => {
  try {
    const product = await Product.find({ supplier: req.params.supplierId , active: true })

    if (!product) {
      next(createError(404, 'Productos no encontrados'))
    } else {
      let sorted = product.sort(() => Math.random() - 0.5).slice(0, 16)
      res.json(sorted)
    }
  } catch(e) {
    next(e)
  }
}

// Get to recommend same categ
module.exports.getRecommendRelated = async (req, res, next) => {
  const criteria = {}
  const { categ } = req.query
  if (categ) criteria.categ = { '$in': categ }
  criteria.active = true
  
  try {
    const listProducts = await Product.find(criteria)
    if (req.currentZip) {
      let okToSend 
      let sorted  = []
      let yesSend = [] 
      let noSend = []
      const promises = listProducts.map((prod) => Shipping.findById(prod.shipping))
      const resolvePromises = await Promise.all( promises )
      listProducts.map((prod, i) => {
        okToSend = resolvePromises[i].shipping.some((el) => el.province === req.currentZip)
        if (okToSend) {
          yesSend.push(prod) 
        } else { 
          noSend.push(prod)
        } 
      })
      sorted = yesSend.sort(() => Math.random() - 0.5).slice(0, 16)
      res.json(sorted)
    } else {
      sorted = listProducts.sort(() => Math.random() - 0.5).slice(0, 16)
      res.json(sorted)
    }
  } catch(e) { next(e) }
}

// Get to recommend BEST SELLERS OKKK
function getOccurrence(array, value) {
  var count = 0;
  array.forEach((v) => (v === value && count++))
  return count
}
module.exports.getBestSellers = async (req, res, next) => {
  try {
    const listProducts = await Product.find({ active: true })

    let allPIds = []
    listProducts.map((p) => allPIds.push(p._id))
    
    const sales = await Sale.find()
    let allSoldProducts = []
    sales.map((sale) => sale.products.forEach((s)=> allSoldProducts.push(s.product)))
    
    const stringify = allSoldProducts.map((p) => p.toString())
    const bestSellersId = allPIds.sort((a, b) => getOccurrence(stringify, (b).toString()) - getOccurrence(stringify, a.toString()))
    
    const promiseProducts = bestSellersId.map((id) => Product.findById(id))
    const resolveProducts = await Promise.all(promiseProducts)

    if (req.currentZip) {
      let okToSend 
      let resolvedProductsZip = []
      const promises = resolveProducts.map((prod) => Shipping.findById(prod.shipping))
      const resolvePromises = await Promise.all( promises )
      resolveProducts.map((prod, i) => {
        okToSend = resolvePromises[i].shipping.some((el) => el.province === req.currentZip)
        if (okToSend) {
          resolvedProductsZip.push({ ...prod, noSend: false })
          
        } else { 
          resolvedProductsZip.push({ ...prod, noSend: true })
        } 
      })
      res.json({resolvedProductsZip})
    } else {
      res.json({resolveProducts})
    }
  } catch(e) { next(e) }
}

// Get to recommend Buy again OKKK
module.exports.getBuyAgain = async (req, res, next) => {

  try {
    const clientSales = await Sale.find({ user: req.params.clientId })
    if (clientSales.length === 0) {
      res.json({ message: 'No sales'})
    } else {
      let allClientProductsIds = []
      clientSales.map((sale) => sale.products.forEach((s)=> allClientProductsIds.push(s.product)))

      const stringify = allClientProductsIds.map((p) => p.toString())
      let uniqueProducts = removeDuplicates(stringify)

      const promiseProducts = uniqueProducts.map((id) => Product.findById(id))
      const resolveProducts = await Promise.all(promiseProducts)
  
      res.json(resolveProducts)
    }
  } catch(e) {
    next(e)
  }
}