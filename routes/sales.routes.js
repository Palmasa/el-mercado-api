const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/auth.middleware')
const roleMiddleware = require('../middlewares/role.middleware')
const hasCartMiddleware = require('../middlewares/cart.middleware')
const saleController = require('../controllers/sales.controller')

router.post(
  '/procesar-venta',
  authMiddleware.isAuthenticated,
  roleMiddleware.isUser,
  hasCartMiddleware.hasCart,
  saleController.create
)

// Cobro venta

// Modificar estado de la venta
router.post(
  '/modificar-estado-venta-vendors',
  authMiddleware.isAuthenticated,
  roleMiddleware.isSupplier,
  saleController.changeStateSupp
)
router.post(
  '/modificar-estado-venta-usuarios',
  authMiddleware.isAuthenticated,
  roleMiddleware.isSupplier,
  saleController.changeStateUsers
)

// Hook de stripe

// Get venta por supplier en curso
router.get(
  '/ventas-en-curso-vendors',
  authMiddleware.isAuthenticated,
  roleMiddleware.isSupplier,
  saleController.getOngoingSales
)

// Get ventas por supplier completas
router.get(
  '/ventas-vendors',
  authMiddleware.isAuthenticated,
  roleMiddleware.isSupplier,
  saleController.getCompletedSales
)

// Get venta por user
router.get(
  '/ventas-ususario',
  authMiddleware.isAuthenticated,
  roleMiddleware.isUser,
  saleController.getUserSales
)

module.exports = router;