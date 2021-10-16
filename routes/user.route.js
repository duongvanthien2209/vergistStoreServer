const express = require("express");

const router = express.Router();

const { protect } = require("../middlewares/user/auth");

const handleError = require("../helpers/handleError.helper");

router.use("/auth", require("./user/auth.route"));

router.use(handleError);

router.use(protect);

router.get("/", (req, res) => {
  res.send("User");
});

module.exports = router;
