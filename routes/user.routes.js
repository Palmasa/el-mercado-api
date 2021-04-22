const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const roleMiddleware = require('../middlewares/role.middleware')

router.post(
  '/editar-usuarios',
  authMiddleware.isAuthenticated,
  roleMiddleware.isUser,
  userController.edit
)

router.post(
  '/editar-usuarios-email',
  authMiddleware.isAuthenticated,
  roleMiddleware.isUser,
  userController.changeEmail
)

router.get(
  '/activate-new-user-email/:token',
  userController.activateNewEmail
)

router.post(
  '/editar-usuarios-pass',
  authMiddleware.isAuthenticated,
  roleMiddleware.isUser,
  userController.changePassword
)

router.get(
  '/activate-new-user-pass/:token',
  userController.activateNewPassword
)

router.delete(
  '/eliminar-cuenta-permanente',
  authMiddleware.isAuthenticated,
  roleMiddleware.isUser,
  userController.delete
)



module.exports = router