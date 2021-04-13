const mongoose = require('mongoose')
const { productCategs } = require("../constants/productCategs")
const { sendTimes } = require('../constants/sendTimes')

const productSchema = new mongoose.Schema(
  {
    supplier: {
      type: mongoose.Types.ObjectId,
      required: 'Se necesita un vendedor para publicar un producto',
      ref: 'Supplier'
    },
    name: {
      type: String,
      trim: true,
      maxlength: [ 40, 'El nombre es demasiado largo' ]
    },
    bio: {
      type: String,
      minlenght: [ 10, "La descripción del producto es demasiado corta" ],
      maxlength: [ 800, "La descripción del producto es demasiado larga" ]
    },
    categ: {
      type: String,
      required: true,
      enum: productCategs,
    },
    measure: {
      type: String,
      required: true,
      enum: [ 'Kg', 'Unidad', 'Pack' ]
    },
    ifPack: String, // describe what contains the pack
    stock: {
      type: Number,
      required: true
    },
    expiration: {
      type: Boolean,
      default: true,
      required: true
    },
    expirationDate: {
      type: Date
    },
    price: {
      type: Number,
      required: true
    },
    sendPrice: {
      type: Number,
    },
    sendPriceDiscount: {
      type: Number // price from 0€
    },
    sendTime: {
      type: String,
      required: true,
      enum: sendTimes
    },
    certificates: [
      {
        img: String,
        name: String,
      },
    ],
  }, {
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

// Virtuals -----------------------
productSchema.virtual('sales', {
  ref: 'Sale',
  foreignField: 'product',
  localField: '_id',
})
productSchema.virtual('cart', {
  ref: 'Cart',
  foreignField: 'product',
  localField: '_id',
})
// --------------------------------

const Product = mongoose.model('Product', productSchema)
module.exports = Product