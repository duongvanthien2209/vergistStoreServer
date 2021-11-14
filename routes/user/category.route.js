const express = require("express");
const router = express.Router();

// Controllers
const { getAll, getDetail } = require("../../controllers/category.controller");

// @route   POST api/user/Category
// @desc    Get All
// @access  Public
router.get("/", getAll);

// @route   POST api/user/Category/:categoryId
// @desc    Get Detail
// @access  Public
router.get("/:categoryId", getDetail);

module.exports = router;
