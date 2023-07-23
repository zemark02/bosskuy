const express = require("express");
const {
  getAllProducts,
  getOneProduct,
  getPurchaseHistory,
  addComment,
} = require("../controllers/product");
const { protect } = require("../middlewares/auth");
const router = express.Router();
router.get("/getAll", getAllProducts);
router.post("/getOne", getOneProduct);
router.post("/getPurchaseHistory", protect, getPurchaseHistory);
router.post("/addComment", protect, addComment);
module.exports = router;
