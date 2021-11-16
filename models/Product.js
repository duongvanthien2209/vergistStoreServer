const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  // 'new', 'hot', empty
  status: {
    type: Object,
    default: {
      new: true,
      hot: false,
    },
  },
  sale: {
    type: Number,
    default: 0,
  },
  des: {
    type: String,
  },
  shortDes: {
    type: String,
  },
  imgs: {
    type: Array,
    default: ["https://picsum.photos/200"],
  },
  price: {
    type: Number,
    required: true,
  },
  rate: {
    type: Number,
    required: true,
    default: 0,
  },
  size: {
    type: String,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  dateCreate: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Product", ProductSchema, "products");
