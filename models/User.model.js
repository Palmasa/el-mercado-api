const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const SALT = 10;
const EMAIL_PATTERN = /^(([^<>()[\]\\.,;:\s@“]+(\.[^<>()[\]\\.,;:\s@“]+)*)|(“.+“))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const { v4: uuidv4 } = require("uuid");
const { ccaa, provinces } = require("../constants/ccaa")

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: [40, "El nombre es demasiado largo"],
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      required: true,
      match: [EMAIL_PATTERN, "Debe introducir una dirección de email válida"],
    },
    password: {
      type: String,
      trim: true,
      required: true,
      minlength: [6, "La contraseña debe tener al menos 6 caracteres"],
    },
    active: {
      type: Boolean,
      default: false,
    },
    token: {
      type: String,
      default: uuidv4(),
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
      zip: Number,
    },
    underAge: {
      type: Boolean,
      default: false,
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
);

// Virtuals -----------------------
userSchema.virtual("cart", {
  ref: "Cart",
  foreignField: "user",
  localField: "_id",
});
userSchema.virtual("sales", {
  ref: "Sales",
  foreignField: "user",
  localField: "_id",
});
userSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "user",
  localField: "_id",
});
userSchema.virtual("messages", {
  ref: "Message",
  foreignField: "user",
  localField: "_id",
});
// --------------------------------

userSchema.methods.checkPassword = function (pass) {
  return bcrypt.compare(pass, this.password);
};

userSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    bcrypt.hash(this.password, SALT).then((hash) => {
      this.password = hash;
      next();
    });
  } else {
    next();
  }
});

userSchema.pre("findOneAndUpdate", function (next) {
  if (this._update.password) {
    bcrypt.hash(this._update.password, SALT).then((hash) => {
      this._update.password = hash;
      next();
    });
  } else {
    next();
  }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
