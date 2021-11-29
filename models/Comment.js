const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  total: {
    type: Number,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  dateCreate: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Comment", CommentSchema, "comments");
