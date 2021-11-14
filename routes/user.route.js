const express = require("express");

const router = express.Router();

const { protect } = require("../middlewares/user/auth");

const handleError = require("../helpers/handleError.helper");

// UnProtected

// Auth
router.use("/auth", require("./user/auth.route"));
router.use(handleError);

// Products
router.use("/products", require("./user/product.route"));
router.use(handleError);

// Categories
router.use("/Category", require("./user/category.route"));
router.use(handleError);

// Protected
router.use(protect);

router.get("/", (req, res) => {
  res.send("User");
});

module.exports = router;
