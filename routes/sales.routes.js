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

router.post('/checkout', hasCartMiddleware.hasCart, saleController.pay)

// Cancelar venta usuario
router.get(
  '/cancelar-venta-usuarios/:saleID',
  authMiddleware.isAuthenticated,
  roleMiddleware.isUser,
  saleController.cancelSale
)

// Get venta por user
router.get(
  '/ventas-usuarios',
  authMiddleware.isAuthenticated,
  roleMiddleware.isUser,
  saleController.getUserSales
)

router.post('/crear-promo', saleController.createPromo)

// Cobro venta

// Modificar estado de la venta
router.post(
  '/modificar-estado-venta-vendors/saleID',
  authMiddleware.isAuthenticated,
  roleMiddleware.isSupplier,
  saleController.changeStateSupp
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

module.exports = router;