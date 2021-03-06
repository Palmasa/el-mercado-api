const express = require('express')
const router = express.Router()
const productController = require('../controllers/product.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const roleMiddleware = require('../middlewares/role.middleware')
const ifUserMiddleware = require('../middlewares/ifUser.middleware')
const hasZipMiddleware = require('../middlewares/zip.middleware')
const upload = require('../config/storage.config')


// Get per supplier 
router.get(
  '/products-suppliers',
  authMiddleware.isAuthenticated,
  productController.getProductsPerSupplier
)

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
router.get(
  '/products/notBoosted',
  productController.getNotBoosted
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

// reactivate no stock
router.patch(
  '/product/plain-reactivate/:id',
  authMiddleware.isAuthenticated,
  roleMiddleware.isSupplier,
  productController.reactivatePlain
)

// Rectivate with stock
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
router.get('/products-to-recommend-related', hasZipMiddleware.hasZip, productController.getRecommendRelated)
router.get('/products-to-recommend-supplier/:supplierId', hasZipMiddleware.hasZip, productController.getRecommendSupplier)
router.get('/products-best-sellers', hasZipMiddleware.hasZip, productController.getBestSellers)
router.get('/products-buy-again/:clientId', hasZipMiddleware.hasZip, productController.getBuyAgain)
router.get('/products/:slug', hasZipMiddleware.hasZip, productController.getOne)

module.exports = router;