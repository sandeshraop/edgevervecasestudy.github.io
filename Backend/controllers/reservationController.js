const Reservation = require("../models/Reservation");
const User = require("../models/User");

// Create reservation (Customer)
exports.createReservation = async (req, res) => {
  try {
    const { reservationDate, reservationTime, numberOfPersons, specialRequest } = req.body;

    // Validation
    if (!reservationDate || !reservationTime || !numberOfPersons) {
      return res.status(400).json({ 
        message: "reservationDate, reservationTime, and numberOfPersons are required" 
      });
    }

    if (numberOfPersons < 1 || numberOfPersons > 20) {
      return res.status(400).json({ 
        message: "Number of persons must be between 1 and 20" 
      });
    }

    // Validate date format and ensure it's not in the past
    const reservationDateTime = new Date(`${reservationDate} ${reservationTime}`);
    const now = new Date();
    
    if (reservationDateTime <= now) {
      return res.status(400).json({ 
        message: "Reservation must be for a future date and time" 
      });
    }

    // Check if slot already has 5 bookings (example limit)
    const existingReservations = await Reservation.count({
      where: {
        reservationDate,
        reservationTime,
        status: ["pending", "confirmed"]
      }
    });

    if (existingReservations >= 5) {
      return res.status(400).json({
        message: "Selected time slot is fully booked. Please choose another time."
      });
    }

    // Check if user already has a reservation at the same time
    const userExistingReservation = await Reservation.findOne({
      where: {
        userId: req.user.id,
        reservationDate,
        reservationTime,
        status: ["pending", "confirmed"]
      }
    });

    if (userExistingReservation) {
      return res.status(400).json({
        message: "You already have a reservation at this time"
      });
    }

    const reservation = await Reservation.create({
      userId: req.user.id,
      reservationDate,
      reservationTime,
      numberOfPersons,
      specialRequest,
      status: "pending"
    });

    // Return reservation with user info
    const reservationWithUser = await Reservation.findByPk(reservation.id, {
      include: {
        model: User,
        attributes: ["id", "name", "email", "phone"]
      }
    });

    res.status(201).json({
      message: "Reservation created successfully",
      reservation: reservationWithUser
    });

  } catch (error) {
    console.error("Create reservation error:", error);
    res.status(500).json({ 
      message: "Server error while creating reservation",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get my reservations (Customer)
exports.getMyReservations = async (req, res) => {
  try {
    const reservations = await Reservation.findAll({
      where: { userId: req.user.id },
      include: {
        model: User,
        attributes: ["id", "name", "email", "phone"]
      },
      order: [['reservationDate', 'ASC'], ['reservationTime', 'ASC']]
    });

    res.json(reservations);

  } catch (error) {
    console.error("Get my reservations error:", error);
    res.status(500).json({ 
      message: "Server error while fetching reservations",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Admin - Get all reservations
exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.findAll({
      include: {
        model: User,
        attributes: ["id", "name", "email", "phone"]
      },
      order: [['reservationDate', 'ASC'], ['reservationTime', 'ASC']]
    });

    res.json(reservations);

  } catch (error) {
    console.error("Get all reservations error:", error);
    res.status(500).json({ 
      message: "Server error while fetching all reservations",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Admin - Update status
exports.updateReservationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["pending", "confirmed", "cancelled"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: "Invalid status. Must be pending, confirmed, or cancelled" 
      });
    }

    const reservation = await Reservation.findByPk(req.params.id, {
      include: {
        model: User,
        attributes: ["id", "name", "email", "phone"]
      }
    });

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    await reservation.update({ status });

    res.json({
      message: "Reservation status updated successfully",
      reservation
    });

  } catch (error) {
    console.error("Update reservation status error:", error);
    res.status(500).json({ 
      message: "Server error while updating reservation status",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Customer - Cancel own reservation
exports.cancelMyReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      },
      include: {
        model: User,
        attributes: ["id", "name", "email", "phone"]
      }
    });

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    if (reservation.status === 'cancelled') {
      return res.status(400).json({ message: "Reservation is already cancelled" });
    }

    // Check if reservation is too close to cancel (e.g., within 2 hours)
    const reservationDateTime = new Date(`${reservation.reservationDate} ${reservation.reservationTime}`);
    const now = new Date();
    const timeDiff = reservationDateTime - now;
    const hoursDiff = timeDiff / (1000 * 60 * 60);

    if (hoursDiff < 2) {
      return res.status(400).json({ 
        message: "Cannot cancel reservation within 2 hours of booking time" 
      });
    }

    await reservation.update({ status: 'cancelled' });

    res.json({
      message: "Reservation cancelled successfully",
      reservation
    });

  } catch (error) {
    console.error("Cancel reservation error:", error);
    res.status(500).json({ 
      message: "Server error while cancelling reservation",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Customer - Modify own reservation
exports.updateMyReservation = async (req, res) => {
  try {
    const { reservationDate, reservationTime, numberOfPersons, specialRequest } = req.body;

    // Validation
    if (!reservationDate || !reservationTime || !numberOfPersons) {
      return res.status(400).json({ 
        message: "reservationDate, reservationTime, and numberOfPersons are required" 
      });
    }

    if (numberOfPersons < 1 || numberOfPersons > 20) {
      return res.status(400).json({ 
        message: "Number of persons must be between 1 and 20" 
      });
    }

    const reservation = await Reservation.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      },
      include: {
        model: User,
        attributes: ["id", "name", "email", "phone"]
      }
    });

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    if (reservation.status === 'cancelled') {
      return res.status(400).json({ message: "Cannot modify cancelled reservation" });
    }

    // Validate new date and time
    const reservationDateTime = new Date(`${reservationDate} ${reservationTime}`);
    const now = new Date();
    
    if (reservationDateTime <= now) {
      return res.status(400).json({ 
        message: "Reservation must be for a future date and time" 
      });
    }

    // Check if new slot is available (excluding current reservation)
    const existingReservations = await Reservation.count({
      where: {
        reservationDate,
        reservationTime,
        status: ["pending", "confirmed"],
        id: { [require('sequelize').Op.ne]: reservation.id }
      }
    });

    if (existingReservations >= 5) {
      return res.status(400).json({
        message: "Selected time slot is fully booked. Please choose another time."
      });
    }

    // Update reservation
    await reservation.update({
      reservationDate,
      reservationTime,
      numberOfPersons,
      specialRequest
    });

    res.json({
      message: "Reservation updated successfully",
      reservation
    });

  } catch (error) {
    console.error("Update reservation error:", error);
    res.status(500).json({ 
      message: "Server error while updating reservation",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
