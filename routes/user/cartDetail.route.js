const express = require("express");
const router = express.Router();

const {
  create,
  update,
  delete: currentDelete,
} = require("../../controllers/user/cartDetail.controller");

// @route   POST api/user/cartDetail
// @desc    Create CartDetail
// @access  Private
router.post("/", create);

// @route   PATCH api/user/cartDetail/:cartDetailId
// @desc    Update CartDetail
// @access  Private
router.patch("/:cartDetailId", update);

// @route   DELETE api/user/cartDetail/:cartDetailId
// @desc    Delete CartDetail
// @access  Private
router.delete("/:cartDetailId", currentDelete);

module.exports = router;
