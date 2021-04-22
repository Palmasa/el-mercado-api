const express = require('express')
const router = express.Router()
const shippingController = require('../controllers/shipping.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const roleMiddleware = require('../middlewares/role.middleware')

// Get shippings per supplier
router.get(
  '/get-all-shippings',
  authMiddleware.isAuthenticated,
  roleMiddleware.isSupplier,
  shippingController.get
)

// Get one shipping
router.get(
  '/get-shippings/:id',
  authMiddleware.isAuthenticated,
  roleMiddleware.isSupplier,
  shippingController.getOne
)

// Create shipping
router.post(
  '/create-shipping',
  authMiddleware.isAuthenticated,
  roleMiddleware.isSupplier,
  shippingController.create
)

// Edit shipping
router.post(
  '/edit-shipping/:id',
  authMiddleware.isAuthenticated,
  roleMiddleware.isSupplier,
  shippingController.edit
)

// Delete shipping
router.delete(
  '/delete-shipping/:id',
  authMiddleware.isAuthenticated,
  roleMiddleware.isSupplier,
  shippingController.delete
)

module.exports = router;