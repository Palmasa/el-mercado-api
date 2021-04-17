const express = require('express')
const router = express.Router()
const indexController = require('../controllers/index.controller')
const productController = require('../controllers/product.controller')
const saleController = require('../controllers/sales.controller')
const supplierController = require('../controllers/supplier.controller')
const authController = require('../controllers/auth.controller')
const authMiddleware = require('../middlewares/auth.middleware')

// AUTH & LOGIN
router.post('/registration', authController.registration)
router.get('/activate/:token', authController.activate)
router.post('/login', authController.login)
router.get('/users/me', authMiddleware.isAuthenticated, authController.get)

// USERS

// SUPPLIERS
router.get('/suppliers', supplierController.suppliers)

// SALES
router.post('/sale', saleController.createSale)

// PRODUCTS
router.get('/products', productController.products)

// INDEX
router.get('/', indexController.index)

module.exports = router;