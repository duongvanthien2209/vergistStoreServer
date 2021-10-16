const express = require("express");

const router = express.Router();

const { login, register } = require("../../controllers/user/auth.controller");

// @route   POST api/user/auth/login
// @desc    Đăng nhập
// @access  Public
router.post("/login", login);

// @route   POST api/user/auth/register
// @desc    Đăng ký
// @access  Public
router.post("/register", register);

module.exports = router;
