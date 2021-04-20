const express = require('express')
const router = express.Router()
const supplierController = require('../controllers/supplier.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const roleMiddleware = require('../middlewares/role.middleware')
const upload = require('../config/storage.config')

// Get suppliers
router.get('/suppliers', supplierController.getAll)
router.get('/suppliers/:slug', supplierController.getOne)

// Create suppliers ---> multer single logo, array img

// Create and edit shipping
router.post(
  '/edit-shipping',
  authMiddleware.isAuthenticated,
  roleMiddleware.isSupplier,
  supplierController.editShipping
)

// Edit supplier

// Config supplier (email, password)

// Delete supplier (desactivate ? )

// STATISTICS ========================================================================
// Get allSales
// ...

module.exports = router;