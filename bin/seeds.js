const mongoose = require('mongoose')
const Supplier = require('../models/Supplier.model')
const { supp } = require('./faker.supplier')
const Product = require('../models/Product.model')
const { productsFake } = require('./faker.products')

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
    /* .then((sup) => { // JFK: SOLUCIONAR EL SUPP DEL PROD
      const products = []

      for (let i = 0; i < productsFake.lenght; i++) {}
        products.push({
          supplier: sup[0]._id,
          ...productsFake[0]
        })
        products.push({
          supplier: sup[1]._id,
          ...productsFake[1]
        })
      return Product.create(products)
    }) */
    .then(() => console.log(`- All data created!`))
    .catch(error => console.error(error))
    .finally(() => process.exit(0))
})