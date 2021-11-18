const express = require("express");

const router = express.Router();

const { protect } = require("../middlewares/user/auth");

const handleError = require("../helpers/handleError.helper");

// Controllers
const {
  changePriceForProducts,
} = require("../controllers/user/addDb.controller");

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

// Carts
router.use("/cart", require("./user/cart.route"));
router.use(handleError);

// Change newPrice to Price for Products
router.get("/updatePrice", changePriceForProducts);

// Protected
router.use(protect);

// Bills
router.use("/bill", require("./user/bill.route"));
router.use(handleError);

module.exports = router;
