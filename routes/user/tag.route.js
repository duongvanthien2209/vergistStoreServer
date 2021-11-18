const express = require("express");
const router = express.Router();

// Controllers
const { getAll, getDetail } = require("../../controllers/tag.controller");

// @route   GET api/user/tags
// @desc    Get All
// @access  Public
router.get("/", getAll);

// @route   GET api/user/tags/:tagId
// @desc    Get Detail
// @access  Public
router.get("/:tagId", getDetail);

module.exports = router;
