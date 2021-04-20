const express = require('express')
const router = express.Router()
const productController = require('../controllers/product.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const roleMiddleware = require('../middlewares/role.middleware')
const upload = require('../config/storage.config')

// Get products
router.get('/products', productController.products)

// Create
router.post(
  '/product/create',
  authMiddleware.isAuthenticated,
  roleMiddleware.isSupplier,
  upload.array('img'),
  productController.create
)

//Update
router.post(
  '/product/update/:id',
  authMiddleware.isAuthenticated,
  roleMiddleware.isSupplier,
  upload.array('img'),
  productController.update
)

// Delete
router.post(
  '/product/delete/:id',
  authMiddleware.isAuthenticated,
  roleMiddleware.isSupplier,
  upload.array('img'),
  productController.delete
)

module.exports = router;