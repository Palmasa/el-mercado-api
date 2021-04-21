const mongoose = require("mongoose")
const { sendTimes } = require('../constants/sendTimes')
const randomNum = () => {
  return `${Math.floor(Math.random() * 10) + 1}${Math.floor(Math.random() * 10) + 1}`
}

const shippingSchema = new mongoose.Schema(
  {
    supplier: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Supplier'
    },
    shipping: [{
      province: String,
      sendPrice: Number,
      sendTime: sendTimes,
      sendDisccount: Number, // price from 0€
    }],
    name: {
      type: String,
      default: randomNum(),
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = doc._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    }
  }
)
// Virtuals -----------------------
shippingSchema.virtual('products', {
  ref: 'Products',
  foreignField: 'shipping',
  localField: '_id',
})
// --------------------------------

const Shipping = mongoose.model("Shipping", shippingSchema);
module.exports = Shipping