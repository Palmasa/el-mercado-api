const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: mongoose.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
        name: String,
        price: Number,
        img: String,
        quantity: Number,
        supplier: String,
        supplierId: String,
        sendPrice: Number,
        sendTime: String
      }
    ],
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User'
    },
    total: Number
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