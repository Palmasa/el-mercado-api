module.exports.slugGeneratorProduct = (name, categ) => {
  let slug = ''
  let randomNum = `${Math.floor(Math.random() * 10) + 1}${Math.floor(Math.random() * 10) + 1}${Math.floor(Math.random() * 10) + 1}${Math.floor(Math.random() * 10) + 1}`
  return (
    name.includes(' ')
    ? slug = `${randomNum}-${categ}/${name.split(' ').join('-')}`
    : slug = `${randomNum}-${categ}/${name}`
  )
}

module.exports.slugGeneratorSupplier = (name, categs) => {
  let slug = ''
  let categ = []
  categs.map((c) => categ.push(c))
  let categSlug = categ
  .map((c) => c.split(' ').filter(c => c != 'y').join('-'))
  console.log(categSlug.join('-'))
  let randomNum = `${Math.floor(Math.random() * 10) + 1}${Math.floor(Math.random() * 10) + 1}${Math.floor(Math.random() * 10) + 1}${Math.floor(Math.random() * 10) + 1}`
  
  return (
    name.includes(' ')
    ? slug = `${randomNum}-${categSlug.join('-')}/${name.split(' ').join('-')}`
    : slug = `${randomNum}-${categSlug.join('-')}/${name}`
  )
}