module.exports.slugGeneratorProduct = (name, categ) => {
  let slug = ''
  let randomNum = Math.floor(Math.random() * 10) + 1
  if (name.includes(' ')) {
    return slug = `${randomNum}${randomNum}${randomNum}${randomNum}${randomNum}-${categ}-${name.split(' ').join('-')}`
  } else {
    return slug = `${randomNum}${randomNum}${randomNum}${randomNum}${randomNum}-${categ}-${name}`
  }
}

module.exports.slugGeneratorSupplier = (name, categs) => {
  let slug = ''
  let categ = []
 categs.map((c) => categ.push(c))
  let randomNum = Math.floor(Math.random() * 10) + 1
  if (name.includes(' ')) {
    return slug = `${randomNum}${randomNum}${randomNum}${randomNum}-${categ.split(' ').join('-')}-${name.split(' ').join('-')}`
  } else {
    return slug = `${randomNum}${randomNum}${randomNum}${randomNum}${randomNum}-${categ.split(' ').join('-')}-${name}`
  }
}