const express = require("express");
const router = express.Router();
const {
  placeOrder,
  getMyOrders,
  updateOrderStatus
} = require("../controllers/orderController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// Customer
router.post("/", protect, placeOrder);
router.get("/my", protect, getMyOrders);

// Admin
router.put("/:id", protect, adminOnly, updateOrderStatus);

module.exports = router;
