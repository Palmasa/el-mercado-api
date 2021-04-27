const express = require('express')
const router = express.Router()
const indexController = require('../controllers/index.controller')
const zipController = require('../controllers/zip.controller')

// Zip
router.post('/create-zip', zipController.zip)

// INFO
router.get('/all-categs', indexController.menuCategs)
router.get('/sub-categs', indexController.productCategs)
router.get('/main-categs', indexController.categs)

// INDEX
router.get('/', indexController.index)

module.exports = router