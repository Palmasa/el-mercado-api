const express = require('express')
const router = express.Router()
const cartController = require('../controllers/cart.controller')
const ifUserMiddleware = require('../middlewares/ifUser.middleware')
const hasZipMiddleware = require('../middlewares/zip.middleware')
const hasCartMiddleware = require('../middlewares/cart.middleware')

router.get(
  '/crear-carrito/:productId',
  hasZipMiddleware.hasZip,
  hasCartMiddleware.hasCart,
  ifUserMiddleware.ifUser,
  cartController.create
)

 router.get(
  '/delete-item/:productId',
  hasCartMiddleware.hasCart,
  cartController.deleteItem
)

router.get(
  '/ajustar-cantidad-item/:productId/:operator',
  hasCartMiddleware.hasCart,
  cartController.adjustQ
)

router.delete(
  '/delete-carrito-perm',
  hasCartMiddleware.hasCart,
  cartController.delete
)

router.get(
  '/carrito/me',
  hasCartMiddleware.hasCart,
  cartController.get
)

module.exports = router;