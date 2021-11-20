const express = require("express");
const router = express.Router();

const {
  getAll,
  create,
  update,
  delete: currentDelete,
} = require("../../controllers/user/cart.controller");

// @route   GET api/user/cart
// @desc    GEt all cartDetail by Cart
// @access  Private
router.get("/", getAll);

// @route   POST api/user/cart
// @desc    Add to cart
// @access  Private
router.post("/", create);

// // @route   PATCH api/user/cart/:cartId
// // @desc    Update to cart
// // @access  Private
// router.patch("/:cartId", update);

// @route   DELETE api/user/cart/:cartId
// @desc    Delete to cart
// @access  Private
router.delete("/:cartId", currentDelete);

module.exports = router;
