const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/admin/auth");

const handleError = require("../helpers/handleError.helper");

// Category
router.use("/Category", require("./admin/category.route"));
router.use(handleError);

// Product
router.use("/products", require("./admin/product.route"));
router.use(handleError);

// Tags
router.use("/tags", require("./admin/tag.route"));
router.use(handleError);

// Middlewares
router.use(protect);

router.get("/", (req, res) => {
  res.send("Admin");
});

module.exports = router;
