const mongoose = require('mongoose')

const saleSchema = new mongoose.Schema(
  {
    product: [
      {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Product',
        quantity: Number
      }
    ],
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    quantity: Number,
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

const Sale = mongoose.model('Sale', saleSchema)
module.exports = Sale