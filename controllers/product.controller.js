const createError = require('http-errors');
const mongoose = require('mongoose')
const Product = require("../models/Product.model");
const Shipping = require('../models/Shipping.model');
const { slugGeneratorProduct } = require('../helpers/slug.generator');

// Get all products
module.exports.getAll = async (req, res, next) => {
  const criteria = {}
  const { categ, search } = req.query
  if (search) criteria.name = new RegExp(search, 'i')
  if (categ) criteria.categ = { '$in': [categ] }
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

    if (!product) {
      next(createError(404, 'Producto no encontrado'))
    } else {

      let okToSend
      if (req.currentZip) {
        const ship = await Shipping.findById(product.shipping)
        okToSend = ship.shipping.some((el) => el.province === req.currentZip)
      }
      res.json({product, okToSend})
    }
  } catch(e) {
    next(e)
  }
}

// Get X to recommend
module.exports.getRecommend = async (req, res, next) => {
  try {
    const product = await Product.find({ supplier: req.body.supplierId , active: true }).limit(5)

    if (!product) {
      next(createError(404, 'Productos no encontrados'))
    } else {
      res.json(products)
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

      req.body.boost = {
        isBoosted: true,
        payment: req.body.payment
      }

      try {
        const editedProduct = await Product.findByIdAndUpdate(
          { _id: req.params.id },
          req.body, 
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
    const listProducts = await Product.find({ supplier: req.currentUser}).populate('sales')
    res.json(listProducts)
  } catch(e) { next(e) }
}