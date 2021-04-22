const express = require('express')
const router = express.Router()
const indexController = require('../controllers/index.controller')
const saleController = require('../controllers/sales.controller')
const zipController = require('../controllers/zip.controller')

// Zip
router.post('/create-zip', zipController.zip)

// SALES
router.post('/sale', saleController.createSale)

// INDEX
router.get('/', indexController.index)

module.exports = router