const createError = require('http-errors');
const { zipData } = require('../constants/ccaa')

module.exports.zipFinder = (zipCode, next) => {
  zipCode = zipCode.toString()

  if (zipCode.length !== 5) {
    next(createError(400, 'El código postal consta de 5 números'))
  }

  let f = zipCode.slice(0, 1)
  if (zipCode === 00 || f.includes('9') || f.includes('8') || f.includes('7') || f.includes('6')) {
    next(createError(400, 'Por favor introduzca un código postal válido'))
  }
  
  zipCode = Number(zipCode.slice(0, 2))
  if (isNaN(zipCode)) {
    next(createError(400, 'El código postal solo puede contener números'))
  }
  
  let zips = Object.values(zipData)
  let provinces = Object.keys(zipData)

  let result = ''
  for (let i = 0; i <= zips.length; i++) {
    if (zips[i] === zipCode) {
      result = provinces[i]
      return result
    }
  }
}