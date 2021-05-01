const express = require('express')
const router = express.Router()
const indexController = require('../controllers/index.controller')
const zipController = require('../controllers/zip.controller')
const hasZipMiddleware = require('../middlewares/zip.middleware')
const hasCartMiddleware = require('../middlewares/cart.middleware')

// Zip
router.post('/create-zip', hasCartMiddleware.hasCart, zipController.zip)
router.get('/zip/me', hasZipMiddleware.hasZip, zipController.get)

// INFO
router.get('/all-categs', indexController.menuCategs)
router.get('/sub-categs', indexController.productCategs)
router.get('/main-categs', indexController.categs)

// INDEX
router.get('/', indexController.index)

module.exports = router