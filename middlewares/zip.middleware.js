module.exports.hasZip = (req, res, next) => {

  const zipDeco = req.header('zDeco')
  
  if (zipDeco) {

    req.currentZip = zipDeco
    next()
    
  } else {
    next()
  }
}