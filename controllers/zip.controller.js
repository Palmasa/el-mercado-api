const { provinces } = require("../constants/ccaa")
const { zipFinder } = require("../helpers/zipFinder")
const createError = require('http-errors')

module.exports.zip = (req, res, next) => {
  const { zip } = req.body

  const zDec = zipFinder(zip, next)

  if (!provinces.includes(zDec)) {
    next(createError(404, 'El código postal debe corresponder al territorio nacional'))
  } else {
    res.json({ zip, zDec }) // a local S
  }
}