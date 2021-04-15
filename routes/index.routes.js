const express = require('express')
const router = express.Router()
const indexController = require('../controllers/index.controller')
const supplierController = require('../controllers/supplier.controller')
const authController = require('../controllers/auth.controller')
const authMiddleware = require('../middlewares/auth.middleware')


router.post('/registration', authController.registration)
router.get('/users/me', authMiddleware.isAuthenticated, authController.get) // devuelve al usuario que está en sesion
router.get('/activate/:token', authController.activate)

router.post('/login', authController.login)

router.get('/suppliers', supplierController.suppliers)
router.get('/products', indexController.products)
router.get('/', indexController.index)

module.exports = router;
