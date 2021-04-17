const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const SALT = 10
const EMAIL_PATTERN = /^(([^<>()[\]\\.,;:\s@“]+(\.[^<>()[\]\\.,;:\s@“]+)*)|(“.+“))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const { ccaa, provinces } = require("../constants/ccaa")
const { supplierCategs, supplierType } = require("../constants/supplierCategs")

const supplierSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
      match: [ EMAIL_PATTERN, 'Debe introducir una dirección de email válida' ]
    },
    password: {
      type: String,
      trim: true,
      required: true,
      minlength: [ 6, 'La contraseña debe tener al menos 6 caracteres' ]
    },
    name: {
      type: String,
      trim: true,
      maxlength: [60, "El nombre del comercio es demasiado largo"],
      required: true
    },
    categ: {
      type: String,
      required: true,
      enum: supplierCategs,
    },
    type: {
      type: String,
      required: true,
      enum: supplierType,
    },
    imgs: {
      enum: [ String ],
    },
    bio: {
      type: String,
      minlenght: [ 25, "La descripción del comercio es demasiado corta" ],
      maxlength: [ 600, "La descripción del comercio es demasiado larga" ],
    },
    CIF: {
      type: String,
      required: true,
      maxlength: [ 9, "El cif debe contener la letra en mayúsculas seguido sin espacio de 8 números" ],
      minlenght: [9,"El cif debe contener la letra en mayúsculas seguido sin espacio de 8 números" ],
    },
    iban: {
      type: String,
      trim: true,
      maxlength: [ 20, "El IBAN contiene 20 caracteres numéricos" ],
      minlenght: [ 20, "El IBAN contiene 20 caracteres numéricos" ],
    },
    address: {
      country: {
        type: String,
        default: "España",
      },
      CA: {
        type: String,
        enum: ccaa
      },
      province: {
        type: String,
        enum: provinces
      },
      city: String,
      street: String,
      number: Number,
      zip: Number,
    },
    certificates: [
      {
        img: String,
        name: String,
      },
    ],
    owner: {
      name: {
        type: String,
        trim: true,
        maxlength: [ 40, 'El nombre es demasiado largo' ]
      },
      img: String,
      bio: {
        type: String,
        minlenght: [ 10, "La descripción del responsable es demasiado corta" ],
        maxlength: [ 600, "La descripción del responsable es demasiado larga" ]
      },
    },
    active: {
      type: Boolean,
      default: false
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
        delete ret.password;
        return ret;
      },
    },
  }
)

// Virtuals -----------------------
supplierSchema.virtual('products', {
  ref: 'Product',
  foreignField: 'supplier',
  localField: '_id',
})

supplierSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'supplier',
  localField: '_id',
})

supplierSchema.virtual('messages', {
  ref: 'Message',
  foreignField: 'supplier',
  localField: '_id',
})
// --------------------------------

supplierSchema.methods.checkPassword = function (pass) {
  return bcrypt.compare(pass, this.password)
}

supplierSchema.pre('save', function (next) {
  if (this.isModified('password')) {
      bcrypt.hash(this.password, SALT).then((hash) => {
          this.password = hash
          next()
      })
  } else {
      next()
  }
})

supplierSchema.pre('findOneAndUpdate', function (next) {
  if (this._update.password) {
      bcrypt
      .hash(this._update.password, SALT)
      .then((hash) => {
          this._update.password = hash
          next()
      })
  } else {
      next()
  }
})

const Supplier = mongoose.model("Supplier", supplierSchema);
module.exports = Supplier;
