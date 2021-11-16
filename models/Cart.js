const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  quantity: {
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

module.exports = mongoose.model("Cart", CartSchema, "carts");
