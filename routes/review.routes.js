const express = require('express')
const router = express.Router()
const reviewController = require('../controllers/review.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const roleMiddleware = require('../middlewares/role.middleware')

router.get(
  '/get-reviews/:supplier',
  reviewController.get
)

router.post(
  '/crear-opinion/:supplier',
  authMiddleware.isAuthenticated,
  roleMiddleware.isUser,
  reviewController.create
)

router.post(
  '/editar-opinion/:review',
  authMiddleware.isAuthenticated,
  roleMiddleware.isUser,
  reviewController.update
)

router.delete(
  '/eliminar-opinion/:review',
  authMiddleware.isAuthenticated,
  roleMiddleware.isUser,
  reviewController.delete
)

module.exports = router;