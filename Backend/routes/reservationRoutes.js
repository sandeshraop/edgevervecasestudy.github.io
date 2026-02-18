const express = require("express");
const router = express.Router();
const {
  createReservation,
  getMyReservations,
  getAllReservations,
  updateReservationStatus,
  cancelMyReservation,
  updateMyReservation
} = require("../controllers/reservationController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// Customer
router.post("/", protect, createReservation);
router.get("/my", protect, getMyReservations);
router.put("/my/:id", protect, updateMyReservation);
router.patch("/my/:id/cancel", protect, cancelMyReservation);

// Admin
router.get("/", protect, adminOnly, getAllReservations);
router.put("/:id", protect, adminOnly, updateReservationStatus);

module.exports = router;
