const mongoose = require('mongoose')
let randomNum = () => {
  let code = []
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  code.push(Math.floor(Math.random() * 10) + 1)
  code.push(Math.floor(Math.random() * 10) + 1)
  code.push(Math.floor(Math.random() * 10) + 1)
  code.push(Math.floor(Math.random() * 10) + 1)
  code.push(Math.floor(Math.random() * 10) + 1)
  code.push(characters.charAt(Math.floor(Math.random() * characters.length)))
  code.push(characters.charAt(Math.floor(Math.random() * characters.length)))
  return code.join("")
}

const promoSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      default: randomNum()
    },
    discount: Number,
    permanent: {
      type: Boolean,
      default: false
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
  })

const Promo = mongoose.model('Promo', promoSchema)
module.exports = Promo