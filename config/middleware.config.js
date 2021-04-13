const express = require ('express')
const logger = require('morgan')
const cors = require('cors')
const helmet = require('helmet')

module.exports = (app) => {
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
  app.use(logger('dev'))
  app.use(cors())
  app.use(helmet({ contentSecurityPolicy: false }))
}