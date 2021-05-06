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
  '/vendors/registration',
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'imgs', maxCount: 1 },
    { name: 'ownerImg', maxCount: 1 }
  ]),
  authSupplierController.registrationSupplier
)
router.get('/vendors/activate/:token', authSupplierController.activateSupplier)
router.post('/vendors/login', authSupplierController.loginSupplier)
router.get('/vendors/me', authMiddleware.isAuthenticated, authSupplierController.getSupplier)

module.exports = router;