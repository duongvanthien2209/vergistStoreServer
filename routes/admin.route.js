const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/user/auth");

const handleError = require("../helpers/handleError.helper");

// Category
router.use("/Category", require("./admin/category.route"));
router.use(handleError);

router.get("/", (req, res) => {
  res.send("Admin");
});

module.exports = router;
