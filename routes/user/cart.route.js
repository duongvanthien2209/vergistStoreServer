const express = require("express");
const router = express.Router();

const {
  getAll,
  add,
  update,
  delete: currentDelete,
} = require("../../controllers/user/cart.controller");

// @route   GET api/user/cart/:cartId
// @desc    GEt all cartDetail by Cart
// @access  Public
router.get("/:cartId", getAll);

// @route   POST api/user/cart
// @desc    Add to cart
// @access  Public
router.post("/", add);

// @route   PATCH api/user/cart/:cartId
// @desc    Update to cart
// @access  Public
router.patch("/:cartId", update);

// @route   DELETE api/user/cart/:cartId
// @desc    Delete to cart
// @access  Public
router.delete("/:cartId", currentDelete);

module.exports = router;
