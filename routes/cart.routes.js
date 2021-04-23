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

router.delete(
  '/delete-carrito',
  hasCartMiddleware.hasCart,
  cartController.delete
) 
module.exports = router;