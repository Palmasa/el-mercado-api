const mongoose = require('mongoose')
const createError = require('http-errors');
const { shipping, selectCCAA } = require('../constants/ccaa')
const Shipping = require('../models/Shipping.model')
const Supplier = require("../models/Supplier.model")

// Get shipping per supplier
module.exports.get = async (req, res, next) => {
  try {
    const supp = await Supplier.findById(req.currentUser).populate('shippings')
    res.json(supp.shippings)
  } catch(e) {
    next(e)
  }
}

// Create shipping
module.exports.create = async (req, res, next) => {
  /* !! LO QUE TIENE QUE LLEGAR DE REACT !!
  {
    "selected": "diferentes opt comentadas en el controlador",
    "provincesSelected": ["A Coruña", "Albacete"], (si se elige la op de byProvinces)
    "ccaaSelected": ["Asturias", "País Vasco"], (si se elige la op de byCCAA)
    "price": "100", es el precio que tendrán las por defecto a no ser que se indique lo contrario en el siguiente campo
    "sendTime": "3/5 días laborables",
    "sendDisccount": "50",
    "differentPrices": [
        { "province": "A Coruña", "time": "Una semana" },
        { "province": "Albacete",  "price": "478900" }
    ]
  } */
  let ship = shipping(req.body.price, req.body.sendTime, req.body.sendDisccount)

  // Price && sendTime
  if (req.body.different.lenght !== 0) {
    req.body.shipping = ship.map((obj) => {
      req.body.different.map((p) => {
        if (obj.province === p.province) {
          obj.sendPrice = p.price || req.body.price
          obj.sendTime = p.time || req.body.sendTime
        }
      })
    })
  }

  // Filter provinces
  let option = [] // op 1 -> todo el territorio nacional
  // op 2 -> solo peninsula
  if (req.body.selected === 'two') option = [ 'Ceuta', 'Melilla', 'Baleares', 'Las Palmas', 'Santa Cruz de Tenerife' ]
  // op 3 -> peninsula y baleares (con ceuta y melilla)
  if (req.body.selected === 'three') option = [ 'Las Palmas', 'Santa Cruz de Tenerife' ]
  // op 4 -> peninsula y baleares (sin ceuta y melilla)
  if (req.body.selected === 'four') option = [ 'Baleares', 'Las Palmas', 'Santa Cruz de Tenerife' ]

  req.body.shipping = ship.filter((obj => !option.includes(obj.province)))

  // op 5 -> solo canarias
  if (req.body.selected === 'five') {
    option = [ 'Las Palmas', 'Santa Cruz de Tenerife']
    req.body.shipping = ship.filter((obj => option.includes(obj.province)))
  }
  // seleccionar provincia a provincia -> byProvince
  if (req.body.selected === 'byProvince') {
    option = [ ...req.body.provincesSelected ]
    req.body.shipping = ship.filter((obj => option.includes(obj.province)))
  }
  // op 2 -> seleccionar ccaa por ccaa -> byCCAA
  if (req.body.selected === 'byCCAA') {
    option = []
    req.body.ccaaSelected.map((ccaa) => selectCCAA[ccaa].map((prov) => option.push(prov)))
    req.body.shipping = ship.filter((obj => option.includes(obj.province)))
  }
  req.body.supplier = req.currentUser
  
  try {
    const shipping = await Shipping.create(req.body)
    res.status(201).json(shipping)
  } catch(e) {
    if (e instanceof mongoose.Error.ValidationError) {
      next(createError(401, { errors: {
        supplier: 'Debe estar autenticado',
        shipping: 'El modelo no se ha podido crear correctamente'
      }}
      ))
    } else {
      next(e)
    }
  }
}

// Edit shipping
module.exports.edit = async (req, res, next) => {
  let ship = shipping(req.body.price, req.body.sendTime, req.body.sendDisccount)

  // Price && sendTime
  if (req.body.different.lenght !== 0) {
    req.body.shipping = ship.map((obj) => {
      req.body.different.map((p) => {
        if (obj.province === p.province) {
          obj.sendPrice = p.price || req.body.price
          obj.sendTime = p.time || req.body.sendTime
        }
      })
    })
  }
  // Filter provinces
  let option = [] // op 1 -> todo el territorio nacional
  // op 2 -> solo peninsula
  if (req.body.selected === 'two') option = [ 'Ceuta', 'Melilla', 'Baleares', 'Las Palmas', 'Santa Cruz de Tenerife' ]
  // op 3 -> peninsula y baleares (con ceuta y melilla)
  if (req.body.selected === 'three') option = [ 'Las Palmas', 'Santa Cruz de Tenerife' ]
  // op 4 -> peninsula y baleares (sin ceuta y melilla)
  if (req.body.selected === 'four') option = [ 'Baleares', 'Las Palmas', 'Santa Cruz de Tenerife' ]

  req.body.shipping = ship.filter((obj => !option.includes(obj.province)))

  // op 5 -> solo canarias
  if (req.body.selected === 'five') {
    option = [ 'Las Palmas', 'Santa Cruz de Tenerife']
    req.body.shipping = ship.filter((obj => option.includes(obj.province)))
  }
  // seleccionar provincia a provincia -> byProvince
  if (req.body.selected === 'byProvince') {
    option = [ ...req.body.provincesSelected ]
    req.body.shipping = ship.filter((obj => option.includes(obj.province)))
  }
  // op 2 -> seleccionar ccaa por ccaa -> byCCAA
  if (req.body.selected === 'byCCAA') {
    option = []
    req.body.ccaaSelected.map((ccaa) => selectCCAA[ccaa].map((prov) => option.push(prov)))
    req.body.shipping = ship.filter((obj => option.includes(obj.province)))
  }
  req.body.supplier = req.currentUser
  
  try {
    const shipping = await Shipping.findById(req.params.id)
    if (!shipping) {
      next(createError(403))
    } else if (shipping.supplier.toString() !== req.currentUser.toString()) {
      next(createError(403))
    } else {

      try {
        const shipping = await Shipping.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true, useFindAndModify: false })
        res.status(201).json(shipping)
      } catch(e) {
        if (e instanceof mongoose.Error.ValidationError) {
          next(createError(401, { errors: {
            supplier: 'Debe estar autenticado',
            shipping: 'El modelo no se ha podido crear correctamente'
          }}
          ))
        } else {
          next(e)
        }
      }
      
    }
  } catch(e) { next(e)}
}

// Delete shipping
module.exports.delete = async (req, res, next) => {

  try {
    const shipping = await Shipping.findById(req.params.id)
    if (!shipping) {
      next(createError(403))
    } else if (shipping.supplier.toString() !== req.currentUser.toString()) {
      next(createError(403))
    } else { 

      try {
        const toDelete = await Shipping.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: `${toDelete.name} successfully deleted`})
      } catch(e) {
        next(e)
      }

    }
  } catch(e) {
    next(e)
  }
}