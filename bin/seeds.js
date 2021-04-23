const mongoose = require('mongoose')
const Supplier = require('../models/Supplier.model')
const { supp } = require('./faker.supplier')
const Product = require('../models/Product.model')
const { productsFake } = require('./faker.products')
const Shipping = require('../models/Shipping.model')
const { fakeShippins } = require('./faker.shippings')
const {slugGeneratorProduct} = require('../helpers/slug.generator')

require('../config/db.config')

mongoose.connection.once('open', () => {

  mongoose.connection.db.dropDatabase()
    .then(() => console.log('Database clear'))
    .then(() => {
      const suppliers = []

      for (let i = 0; i < 5; i++) {
        suppliers.push({
          ...supp[i],
          password: 'Elmercado21',
          CIF: '58358148P',
          iban: 09876543211234567890,
          active: true
        })
      }

      return Supplier.create(suppliers)
    })
    /* .then((sup) => {
      const shipps = []
      shipps.push({
        ...fakeShippins[0],
        supplier: sup[0]._id
      })
      shipps.push({
        ...fakeShippins[1],
        supplier: sup[1]._id
      })
      return Shipping.create(shipps)
      .then((ship) => {
        const products = []
          products.push({
            shipping: ship[0]._id,
            supplier: sup[0]._id,
            ...productsFake[0],
            slug: slugGeneratorProduct(productsFake[0].name, productsFake[0].categ)
          })
          products.push({
            shipping: ship[1]._id,
            supplier: sup[1]._id,
            ...productsFake[1],
            slug: slugGeneratorProduct(productsFake[1].name, productsFake[1].categ)
          })
        return Product.create(products)
      })
    }) */
    .then(() => console.log(`- All data created!`))
    .catch(error => console.error(error))
    .finally(() => process.exit(0))
})