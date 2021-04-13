const express = require('express')
const router = express.Router()
const indexController = require('../controllers/index.controller')

// example route, delete
router.get('/', indexController.index);

module.exports = router;
