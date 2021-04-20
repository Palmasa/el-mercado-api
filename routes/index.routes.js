const express = require('express')
const router = express.Router()
const indexController = require('../controllers/index.controller')
const saleController = require('../controllers/sales.controller')


// USERS

// SALES
router.post('/sale', saleController.createSale)

// INDEX
router.get('/', indexController.index)

module.exports = router