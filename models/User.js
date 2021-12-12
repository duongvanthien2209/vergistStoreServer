const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },

  lastName: {
    type: String,
    required: true,
  },

  fullName: {
    type: String,
    required: true,
  },

  phoneNumber: {
    type: String,
    // required: true,
    unique: true,
  },

  address: {
    type: String,
    // required: true,
  },

  birthday: {
    type: Date,
    // required: true,
  },

  avatar: {
    type: String,
    default: "https://picsum.photos/200",
  },

  gender: {
    type: Boolean,
    // required: true,
  },

  email: {
    type: String,
    // required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  // admin, user
  role: {
    type: String,
    default: "user",
    required: true,
  },

  // Activated, Blocked
  status: {
    type: String,
    default: "blocked",
    required: true,
  },
});

module.exports = mongoose.model("User", UserSchema, "users");
