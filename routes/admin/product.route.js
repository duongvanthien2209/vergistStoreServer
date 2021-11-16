const express = require("express");
const multer = require("multer");

const {
  addProduct,
  updateProduct,
} = require("../../controllers/product.controller");

const upload = multer({ dest: "public/uploads/products" });

const router = express.Router();

// @route   POST api/user/products/:productId
// @desc    Get Detail Product
// @access  Public
router.post("/", upload.array("imgs", 10), addProduct);

// @route   PATCH api/user/products/:productId
// @desc    Get Detail Product
// @access  Public
router.patch("/:productId", upload.array("imgs", 10), updateProduct);

module.exports = router;
