const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema(
  {
    supplier: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Supplier'
    },
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    rate: {
      type: String,
      required: true,
      enum: [ 'Excelente', 'Bueno', 'Intermedio', 'Malo' ]
    },
    review: String
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = doc._id
        delete ret._id
        delete ret.__v
        return ret
      }
    }
  }
)

const Review = mongoose.model('Review', reviewSchema)
module.exports = Review