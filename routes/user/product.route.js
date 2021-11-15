const express = require("express");
const multer = require("multer");

const router = express.Router();

const upload = multer({ dest: "public/uploads/products" });

// Controllers
const {
  getAll,
  getProduct,
  addProduct,
} = require("../../controllers/product.controller");

// @route   POST api/user/products
// @desc    Filter Products
// @access  Public
router.get("/", getAll);

// @route   POST api/user/products/:productId
// @desc    Get Detail Product
// @access  Public
router.get("/:productId", getProduct);

// @route   POST api/user/products/:productId
// @desc    Get Detail Product
// @access  Public
router.post("/", upload.array("imgs", 10), addProduct);

module.exports = router;
