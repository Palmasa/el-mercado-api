const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema(
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
    message: {
      type: String,
      required: true
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

const Message = mongoose.model('Message', messageSchema)
module.exports = Message