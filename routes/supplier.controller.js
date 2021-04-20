const express = require('express')
const router = express.Router()

// Get suppliers
router.get('/suppliers', productController.getAll)
router.get('/suppliers/:slug', productController.getOne)

module.exports = router;