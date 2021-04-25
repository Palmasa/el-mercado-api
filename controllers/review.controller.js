const Review = require("../models/Review.model")
const Sale = require("../models/Sale.model")
const createError = require('http-errors');

module.exports.get = async (req, res, next) => {
  try {
    const reviews = await Review.find({ supplier: req.params.supplier })
    res.json(reviews)
  } catch(e) { next(e) }
}

module.exports.create = async (req, res, next) => {
  try {
    const verify = await Sale.find({ user: req.currentUser, supplier: req.params.supplier })

    if (verify.length === 0) {
      next(createError(404, 'Solo puede dar su opinión si ha sido cliente del vendedor'))
    } else {
      const review = await Review.create({
        supplier: req.params.supplier,
        user: req.currentUser,
        review: req.body.review,
        rate: req.body.rate
      })
      res.json(review)
    }
  } catch(e) { next(e) }
}

module.exports.update = async (req, res, next) => {
  try {
    const review = await Review.findOneAndUpdate(
      { _id: req.params.review },
      { review: req.body.review, rate: req.body.rate },
      { new: true, useFindAndModify: false })
    
      res.json(review)
  } catch(e) { next(e) }
}

module.exports.delete = async (req, res, next) => {
  try {
    await Review.findByIdAndDelete(req.params.review)
    res.json({message: 'Comentario eliminado correctamente'})
  } catch(e) { next(e) }
}