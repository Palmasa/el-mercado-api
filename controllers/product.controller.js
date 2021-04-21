const createError = require('http-errors');
const mongoose = require('mongoose')
const Product = require("../models/Product.model");
const Shipping = require('../models/Shipping.model');
const calcs = require('../calcs/product.rank');
const { slugGeneratorProduct } = require('../helpers/slug.generator');

// Get all products
module.exports.getAll = async (req, res, next) => {
  const criteria = {}
  const { categ, search } = req.query

  if (search) {
    criteria.name = new RegExp(search, 'i')
  }

  if (categ) {
    criteria.categ = { '$in': [categ] }
  }

  criteria.active = true
  
  try { 
    const listProducts = await Product.find(criteria)
    res.json(listProducts)
  } catch(e) { next(e) }
}

// Get one product
module.exports.getOne = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
    if (!product) {
      next(createError(404, 'Producto no encontrado'))
    } else {
      res.json(product)
    }
  } catch(e) {
    next(e)
  }
}

// Create product
// imp! (you will need it in the view)  ->
// to create a product you need to find the shippings of the current supplier for lines 57 and 58
module.exports.create = async (req, res, next) => {
  req.body.supplier = req.currentUser
  req.body.rank = calcs.rank
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

// Edit product ++Boost product
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
        const toDelete = await Product.findByIdAndDelete(req.params.id, { new: true})
        res.status(200).json({ message: `${toDelete.name} successfully deleted`})
      } catch(e) {
        next(e)
      }

    }
  } catch(e) {
    next(e)
  }
}