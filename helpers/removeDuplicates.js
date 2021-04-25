module.exports.removeDuplicates = (array) => {
  let myArray = [...array]
  return myArray.filter((v, i) => myArray.indexOf(v) === i)
}