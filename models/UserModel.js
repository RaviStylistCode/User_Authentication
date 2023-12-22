const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please enter your name"],
    minLength: [4, "name must be 4 character long"],
    maxLength: [30, "name should not be exceed 30 character"],
  },

  email: {
    type: String,
    required: [true, "please enter your email"],
    unique: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },

  password: {
    type: String,
    required: [true, "please enter the password"],
    minLength: [6, "password must be 6 character"],
    select: false,
  },

  role: {
    type: String,
    default: "user",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  verified: {
    type: Boolean,
    default: false,
  },
  otp: Number,
  otp_expire: Date,
  resetPasswordotp:Number,
  resetPassword_expire:Date
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.getJwt=function(){
    return jwt.sign({_id:this._id},process.env.JWT_SECRET);
}

userSchema.methods.comparePassword = async function (getPassword) {
  return await bcrypt.compare(getPassword, this.password);
};

userSchema.index({otp_expire:1},{expireAfterSeconds:0});

module.exports = mongoose.model("user", userSchema);
