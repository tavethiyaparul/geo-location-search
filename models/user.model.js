const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Enter Your Name"],
      maxlength: [30, "Name can not exceed 30 charcter"],
      minlength: [4, "Name should have more the 4 charcter"],
    },
    email: {
      type: String,
      required: [true, "Please Enter Your Email"],
      unique: true,
      validator: [validator.isEmail, "Please Enter valide Email"],
    },
    password: {
      type: String,
      required: [true, "Please Enter Password"],
      minlength: [8, "Password should be greater then 8 charcter"],
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECERT, {
    expiresIn: process.env.JWT_EXPAIR,
  });
};

userSchema.methods.comparePassword = async function (enterpassword) {
  return await bcrypt.compare(enterpassword, this.password);
};

module.exports = mongoose.model("user", userSchema);
