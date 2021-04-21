const express = require('express')
const router = express.Router()
const shippingController = require('../controllers/shipping.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const roleMiddleware = require('../middlewares/role.middleware')

// Get shippings per supplier
router.get(
  '/get-shipping',
  authMiddleware.isAuthenticated,
  roleMiddleware.isSupplier,
  shippingController.get
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