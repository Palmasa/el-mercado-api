const mongoose = require('mongoose')
const { productCategs } = require("../constants/productCategs")

const productSchema = new mongoose.Schema(
  {
    supplier: {
      type: mongoose.Types.ObjectId,
      required: 'Se necesita un vendedor para publicar un producto',
      ref: 'Supplier'
    },
    shipping: {
      type: mongoose.Types.ObjectId,
      required: 'Se necesita un modelo de envío para publicar un producto',
      ref: 'Shipping'
    },
    name: {
      type: String,
      trim: true,
      required: true
    },
    bio: {
      type: String,
      required: true
    },
    categ: {
      type: String,
      required: true,
      enum: productCategs,
    },
    img: [{
      type: String,
      required: true
    }],
    measure: {
      type: String,
      required: true,
      enum: [ 'Kg', 'Unidad', 'Pack', 'L', 'ml' ]
    },
    ifPack: {
      u: Number
    },
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
    certificates: [
      {
        name: String,
      },
    ],
    active: {
      type: Boolean,
      default: true
    },
    slug: {
      type: String,
      required: true
    },
    isBoosted: {
        type: Boolean,
        default: false,
      },
    boostPayment: Number,
    boostStart: Date,
    boostEnd: Date,
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