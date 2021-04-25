const express = require('express')
const router = express.Router()
const indexController = require('../controllers/index.controller')
const zipController = require('../controllers/zip.controller')

// Zip
router.post('/create-zip', zipController.zip)

// SALES

// INDEX
router.get('/', indexController.index)

module.exports = router