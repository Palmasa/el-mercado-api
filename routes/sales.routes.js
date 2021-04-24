const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/auth.middleware')
const roleMiddleware = require('../middlewares/role.middleware')
const hasCartMiddleware = require('../middlewares/cart.middleware')
const saleController = require('../controllers/sales.controller')

router.post('/procesar-venta',
  authMiddleware.isAuthenticated,
  roleMiddleware.isUser,
  hasCartMiddleware.hasCart,
  saleController.create
)

module.exports = router;