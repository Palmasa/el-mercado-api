const createError = require('http-errors');
const mongoose = require('mongoose')
const Supplier = require("../models/Supplier.model");
const Product = require("../models/Product.model");

// Get all products
module.exports.products = async (req, res, next) => {
  const criteria = {}
  const { category, search } = req.query

  if (search) {
    criteria.name = new RegExp(search, 'i')
  }

  if (category) {
    criteria.categories = { '$in': [category] }
  }
  
  try { 
    const listProducts = await Product.find(criteria)
    res.json(listProducts)
  } catch(e) { next(e) }
}

// Create product
module.exports.create = async (req, res, next) => {
  req.body.supplier = req.currentUser

  if (req.files) {
    const arrFiles = []
    req.files.map(file => arrFiles.push(file.path))
    req.body.img = arrFiles
  }

  try { 
    const newProduct = await Product.create(req.body)
    res.status(201).json(newProduct)
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
      }}
      ))
    } else {
      next(e)
    }
    next(e)
  }
}

// Edit product ++Boost product
module.exports.update = async (req, res, next) => {
  req.body.supplier = req.currentUser

  if (req.files) {
    const arrFiles = []
    req.files.map(file => arrFiles.push(file.path))
    req.body.img = arrFiles
  }

  try {
    
    const product = await Product.findById(req.params.id)
    if (!product) {
      next(createError(403))
    } else if (product.supplier.toString() !== req.currentUser.toString()) {
      next(createError(403))
    } else {
  
      try { 
        const editedProduct = await Product.findByIdAndUpdate({ _id: req.params.id }, req.body, { useFindAndModify: false })
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
          }}
          ))
        } else {
          next(e)
        }
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
        res.status(200).json({ message: `${toDelete.name} successfully deleted`})
      } catch(e) {
        next(e)
      }

    }
  } catch(e) {
    next(e)
  }
}