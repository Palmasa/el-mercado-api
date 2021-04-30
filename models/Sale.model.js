const mongoose = require('mongoose')

const saleSchema = new mongoose.Schema(
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
        sendPrice: Number
      }
    ],
    state: {
      type: String,
      enum: [ 'Procesando', 'Aceptado', 'Denegado', 'Cancelado', 'Preparando', 'Enviado', 'Entregado' ],
      default: 'Procesando'
    },
    address: {
      country: {
        type: String,
        default: "España",
      },
      city: String,
      street: String,
      number: Number,
      block: String,
      zip: Number
    },
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    supplier: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Supplier'
    },
    price: Number,
    paid: {
      type: Boolean,
      default: false
    },
    relatedSales: String
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