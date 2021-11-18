const mongoose = require("mongoose");

const BillSchema = new mongoose.Schema({
  total: {
    type: Number,
    required: true,
    default: 0,
  },
  dateCreate: {
    type: Date,
    default: Date.now(),
  },
  // 'Chưa thanh toán', 'Đã thanh toán', 'Đang giao hàng'
  status: {
    type: String,
    default: "Chưa thanh toán",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Bill", BillSchema, "bills");
