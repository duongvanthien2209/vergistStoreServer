const express = require("express");
const router = express.Router();

// Controllers
const {
  getAllByUser,
  getDetail,
  create,
  updateStatus,
} = require("../../controllers/bill.controller");

// @route   GET api/user/bill
// @desc    GET Bill By User
// @access  Private
router.get("/", getAllByUser);

// @route   GET api/user/bill/:billId?_limit=&_page=
// @desc    GET Bill Detail
// @access  Private
router.get("/:billId", getDetail);

// @route   GET api/user/bill/create/:cartId
// @desc    Create Bill From Cart
// @access  Private
router.post("/create/:cartId", create);

// @route   POST api/user/bill/:billId
// @desc    Update Status For Bill -> người dùng hủy đơn hàng
// @access  Private
router.post("/:billId", updateStatus);

module.exports = router;
