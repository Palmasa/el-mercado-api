module.exports.slugGeneratorProduct = (name, categ) => {
  let slug = ''
  let randomNum = `${Math.floor(Math.random() * 10) + 1}${Math.floor(Math.random() * 10) + 1}${Math.floor(Math.random() * 10) + 1}${Math.floor(Math.random() * 10) + 1}`
  return (
    name.includes(' ')
    ? slug = `${randomNum}-${(categ).toLowerCase()}-${(name).toLowerCase().split(' ').join('-')}`
    : slug = `${randomNum}-${(categ).toLowerCase()}-${(name).toLowerCase()}`
  )
}

module.exports.slugGeneratorSupplier = (name) => {
  let slug = ''
  let randomNum = `${Math.floor(Math.random() * 10) + 1}${Math.floor(Math.random() * 10) + 1}${Math.floor(Math.random() * 10) + 1}${Math.floor(Math.random() * 10) + 1}`
  
  return (
    name.includes(' ')
    ? slug = `${randomNum}-${name.split(' ').join('-')}`
    : slug = `${randomNum}-${name}`
  )
}