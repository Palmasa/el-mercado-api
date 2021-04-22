const express = require('express')
const router = express.Router()
const productController = require('../controllers/product.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const roleMiddleware = require('../middlewares/role.middleware')
const hasZipMiddleware = require('../middlewares/zip.middleware')
const upload = require('../config/storage.config')

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

// Boost
router.get(
  '/products/boosted',
  productController.getBoosted
)
router.post(
  '/products/boost/:id',
  authMiddleware.isAuthenticated,
  roleMiddleware.isSupplier,
  productController.boost
)

// Desactivate
router.patch(
  '/product/desactivate/:id',
  authMiddleware.isAuthenticated,
  roleMiddleware.isSupplier,
  productController.desactivate
)

// Rectivate
router.post(
  '/product/reactivate/:id',
  authMiddleware.isAuthenticated,
  roleMiddleware.isSupplier,
  productController.reactivate
)

// Delete
router.delete(
  '/product/delete/:id',
  authMiddleware.isAuthenticated,
  roleMiddleware.isSupplier,
  upload.array('img'),
  productController.delete
)

// Get products
router.get('/products', hasZipMiddleware.hasZip, productController.getAll)
router.post('/products-to-recommend', hasZipMiddleware.hasZip, productController.getRecommend)
router.get('/products/:slug', hasZipMiddleware.hasZip, productController.getOne)

module.exports = router;