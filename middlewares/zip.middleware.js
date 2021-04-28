module.exports.hasZip = (req, res, next) => {

  const zipDeco = req.header('zip')
  
  if (zipDeco) {
    req.currentZip = zipDeco
    next()
    
  } else {
    next()
  }
}