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
      maxlength: [ 40, 'El nombre es demasiado largo' ],
      required: true
    },
    bio: {
      type: String,
      minlenght: [ 10, "La descripción del producto es demasiado corta" ],
      maxlength: [ 800, "La descripción del producto es demasiado larga" ],
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
      enum: [ 'Kg', 'Unidad', 'Pack' ]
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
        img: String,
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
    boost: {
      isBoosted: Boolean,
      payment: Number,
    }
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