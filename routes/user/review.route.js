const express = require("express");

const { protect } = require("../../middlewares/user/auth");

const router = express.Router();

const {
  getByProduct,
  create,
  update,
  delete: currentDelete,
} = require("../../controllers/review.controller");

// @route   GET api/user/review/:productId
// @desc    Get All By Product
// @access  Private
router.get("/:productId", getByProduct);

router.use(protect);

// @route   POST api/user/review/:productId
// @desc    Create Review
// @access  Private
router.post("/:productId", create);

// @route   PATCH api/user/review/:reviewId
// @desc    Update Review
// @access  Private
router.patch("/:reviewId", update);

// @route   DELETE api/user/review/:reviewId
// @desc    Delete Review
// @access  Private
router.delete("/:reviewId", currentDelete);

module.exports = router;
