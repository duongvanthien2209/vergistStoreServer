const express = require("express");
const multer = require("multer");

const router = express.Router();

const { protect } = require("../../middlewares/user/auth");
const upload = multer({ dest: "public/uploads/products" });

const { login, register } = require("../../controllers/user/auth.controller");
const {
  update,
  updatePassword,
  updatePasswordConfirm,
} = require("../../controllers/user.controller");

// @route   POST api/user/auth/login
// @desc    Đăng nhập
// @access  Public
router.post("/login", login);

// @route   POST api/user/auth/register
// @desc    Đăng ký
// @access  Public
router.post("/register", register);

router.use(protect);

// @route   PATCH api/user/auth
// @desc    Cập nhật thông tin người dùng
// @access  Private
router.patch("/", upload.single("avatar"), update);

// @route   PATCH api/user/auth/updatePassword
// @desc    Cập nhật mật khẩu
// @access  Private
router.patch("/updatePassword", updatePassword);

// @route   PATCH api/user/auth/confirmPassword/:token
// @desc    Xác nhận cập nhật mật khẩu
// @access  Private
router.patch("/confirmPassword/:token", updatePasswordConfirm);

module.exports = router;
