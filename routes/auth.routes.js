const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth.controller')
const authSupplierController = require('../controllers/authSupplier.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const upload = require('../config/storage.config')

// USER
router.post('/registration', authController.registration)
router.get('/activate/:token', authController.activate)
router.post('/login', authController.login)
router.get('/users/me', authMiddleware.isAuthenticated, authController.get)

// SUPPLIER
router.post(
  '/vendor/registration',
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'imgs', maxCount: 4 },
    { name: 'owner[imgs]', maxCount: 1 }
  ]),
  authSupplierController.registrationSupplier
)
router.get('/vendor/activate/:token', authSupplierController.activateSupplier)
router.post('/vendor/login', authSupplierController.loginSupplier)
router.get('/vendor/me', authMiddleware.isAuthenticated, authSupplierController.getSupplier)

module.exports = router;