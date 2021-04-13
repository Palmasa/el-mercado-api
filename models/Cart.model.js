const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema(
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
    }
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

const Cart = mongoose.model('Cart', cartSchema)
module.exports = Cart