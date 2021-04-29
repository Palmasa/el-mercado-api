module.exports.hasCart = (req, res, next) => {

  const cart = req.header('cart')
  
  if (cart) {
    req.currentCart = cart
    next()
    
  } else {
    next()
  }
}