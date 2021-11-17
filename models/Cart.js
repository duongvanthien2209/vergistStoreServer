const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  dateCreate: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Cart", CartSchema, "carts");
