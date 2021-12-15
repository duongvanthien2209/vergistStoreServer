const express = require("express");
const router = express.Router();

const {
  getAllByUser,
  create,
} = require("../../controllers/discountCodeDetail.controller");

// @route   GET api/user/discountCodeDetail?_limit&_page
// @desc    Get All DiscountCode By User
// @access  Private
router.get("/", getAllByUser);

// @route   POST api/user/discountCodeDetail/:discountCodeId
// @desc    Create DiscountCodeDetail
// @access  Private
router.post("/:discountCodeId", create);

module.exports = router;
