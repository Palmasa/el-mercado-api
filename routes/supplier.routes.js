const express = require('express')
const router = express.Router()
const supplierController = require('../controllers/supplier.controller')
const hasZipMiddleware = require('../middlewares/zip.middleware')
const authMiddleware = require('../middlewares/auth.middleware')
const roleMiddleware = require('../middlewares/role.middleware')
const upload = require('../config/storage.config')

// Get suppliers
router.get('/suppliers', hasZipMiddleware.hasZip, supplierController.getAll)
router.get('/suppliers/:slug', supplierController.getOne)

// Edit supplier profile
router.patch(
  '/edit-vendor-profile/:slug',
  authMiddleware.isAuthenticated,
  roleMiddleware.isSupplier,
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'imgs', maxCount: 4 },
    { name: 'ownerImg', maxCount: 1 }
  ]),
  supplierController.editProfile
)

// Config supplier (email, password)
router.post(
  '/edit-vendor-email',
  authMiddleware.isAuthenticated,
  roleMiddleware.isSupplier,
  supplierController.changeEmail
)

router.get(
  '/activate-new-vendor-email/:token',
  supplierController.activateNewEmail
)

router.post(
  '/edit-vendor-pass',
  authMiddleware.isAuthenticated,
  roleMiddleware.isSupplier,
  supplierController.changePassword
)

router.get(
  '/activate-new-vendor-pass/:token',
  supplierController.activateNewPassword
)

// Delete supplier
router.delete(
  '/delete-vendor-perm',
  authMiddleware.isAuthenticated,
  roleMiddleware.isSupplier,
  supplierController.delete
)


module.exports = router;