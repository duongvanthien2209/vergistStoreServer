const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },

  firstName: {
    type: String,
    required: true,
  },

  lastName: {
    type: String,
    required: true,
  },

  phoneNumber: {
    type: String,
    required: true,
  },

  address: {
    type: String,
    required: true,
  },

  birthday: {
    type: Date,
    required: true,
  },

  avatar: {
    type: String,
    default: "https://picsum.photos/200",
  },

  gender: {
    type: Boolean,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  // isVerified: {
  //   type: Boolean,
  //   default: false,
  // },
  // resetPasswordToken: String,
  // resetPasswordExpire: Date,

  // date: {
  //   type: Date,
  //   default: Date.now,
  // },
});

module.exports = mongoose.model("User", UserSchema, "users");
