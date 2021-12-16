const express = require("express");
const router = express.Router();

const { getAll } = require("../../controllers/discountCode.controller");

// @route   GET api/user/discountCode
// @desc    Get All DiscountCode
// @access  Public
router.get("/", getAll);

module.exports = router;
