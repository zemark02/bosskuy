const express = require("express");
const {
  getCart,
  addToCart,
  checkout,
  clearCart,
} = require("../controllers/cart");
const { protect } = require("../middlewares/auth");
const router = express.Router();
router.post("/getCart", protect, getCart);
router.post("/addProduct", protect, addToCart);
router.post("/checkout", protect, checkout);
router.post("/clearCart", protect, clearCart);

module.exports = router;
