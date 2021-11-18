const express = require("express");
const router = express.Router();

// Controllers
const {
  getAll,
  getAllByUser,
  getDetail,
  updateBillDetail,
  delete: currentDelete,
} = require("../../controllers/bill.controller");

// @route   GET api/user/bill
// @desc    GET All Bill
// @access  Private
router.get("/", getAll);

// @route   GET api/user/bill/getByUser/:userId
// @desc    GET Bill By User
// @access  Private
router.get("/getByUser/:userId", getAllByUser);

// @route   GET api/user/bill/:billId?_limit=&_page=
// @desc    GET Bill Detail
// @access  Private
router.get("/:billId", getDetail);

// @route   PATCH api/user/bill/:billId
// @desc    Update Bill
// @access  Private
router.patch("/:billId", updateBillDetail);

// @route   DELETE api/user/bill/:billId
// @desc    Update Bill
// @access  Private
router.patch("/:billId", currentDelete);

module.exports = router;
