const express = require("express");
const router = express.Router();
const {
  createMenuItem,
  getMenuItems,
  getMenuByCategory,
  updateMenuItem,
  deleteMenuItem
} = require("../controllers/menuController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/", protect, adminOnly, createMenuItem);
router.get("/", getMenuItems);
router.get("/category/:categoryId", getMenuByCategory);
router.put("/:id", protect, adminOnly, updateMenuItem);
router.delete("/:id", protect, adminOnly, deleteMenuItem);

module.exports = router;
