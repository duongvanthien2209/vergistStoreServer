const express = require("express");

const router = express.Router();

// Controllers
const { getAll, getProduct } = require("../../controllers/product.controller");

// @route   POST api/user/products
// @desc    Filter Products
// @access  Public
router.get("/", getAll);

// @route   POST api/user/products/:productId
// @desc    Get Detail Product
// @access  Public
router.get("/:productId", getProduct);

module.exports = router;
