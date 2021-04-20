const { slugGeneratorSupplier } = require("../helpers/slug.generator")
const { shipping, selectCCAA } = require('../constants/ccaa')
const Supplier = require("../models/Supplier.model")

// Get all suppliers
// JFK: ordenar suppliers por volumen de ventas
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
    const listSuppliers = await Supplier.find(criteria)
    res.json(listSuppliers)
  }
  catch { next }
}

module.exports.getOne = async (req, res, next) => {
  try {
    const supplier = await Supplier.findOne({ slug: req.params.slug, active: true })
    if (!supplier) {
      next(createError(404, 'Vendedor no encontrado'))
    } else {
      res.json(supplier)
    }
  } catch(e) {
    next(e)
  }
}

module.exports.create = async (req, res, next) => {
  
  req.body.slug = slugGeneratorSupplier(req.body.name, req.body.categ)
  req.body.shipping = []
}

// EDit and create shipping
// JFK: tiempo de entrega por zonas (AÑADIR AL OBJETO DE SHIPPING)
module.exports.editShipping = async (req, res, next) => {
  /* !! LO QUE TIENE QUE LLEGAR DE REACT !!
  {
    "selected": "diferentes opt comentadas en el controlador",
    "provincesSelected": ["A Coruña", "Albacete"], (si se elige la op de byProvinces)
    "ccaaSelected": ["Asturias", "País Vasco"], (si se elige la op de byCCAA)
    "price": "100", es el precio que tendrán las por defecto a no ser que se indique lo contrario en el siguiente campo
    "differentPrices": [
        { "province": "A Coruña", "price": "0" },
        { "province": "Albacete",  "price": "478900" }
    ]
  } */
  let ship = shipping(req.body.price)

  // Price
  if (req.body.differentPrices.lenght !== 0) {
    req.body.shipping = ship.map((obj) => {
      req.body.differentPrices.map((p) => {
        if (obj.province === p.province) {
          obj.sendPrice = p.price
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

  try {
    const supp = await Supplier.findByIdAndUpdate( req.currentUser, { shipping: req.body.shipping }, { useFindAndModify: false })
    res.status(201).json(supp)
  } catch(e) {
    next(e)
  }
  
}
