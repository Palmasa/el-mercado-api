const mongoose = require('mongoose')
const Product = require('../models/Product.model')
const Supplier = require('../models/Supplier.model')
const { owner, address, commerce } = require('./ownFaker')
const { productsFake } = require('./fakerProducts')
const Sale = require('../models/Sale.model')

require('../config/db.config')

mongoose.connection.once('open', () => {

  mongoose.connection.db.dropDatabase()
    .then(() => console.log('Database clear'))
    .then(() => {
      const suppliers = []

      for (let i = 0; i < 5; i++) {
        suppliers.push({
          ...commerce[i],
          password: 'Elmercado21',
          CIF: '58358148P',
          address: address[i],
          ...owner[i],
          active: true
        })
      }

      return Supplier.create(suppliers)
    })
    .then((sup) => {
      const products = []
        products.push({
          supplier: sup[0]._id,
          ...productsFake[0]
        })
        products.push({
          supplier: sup[1]._id,
          ...productsFake[1]
        })
      return Product.create(products)
    })
/*     .then((prod) => {
      return Sale.create({
        products: [
          {
            product: prod[0]._id,
            quantity: 2,
          },
          {
            product: prod[1]._id,
            quantity: 5,
          }
        ],
        user: '6078450fed238b34ebe8594x'
      })
    }) */
    .then(() => console.log(`- All data created!`))
    .catch(error => console.error(error))
    .finally(() => process.exit(0))
})