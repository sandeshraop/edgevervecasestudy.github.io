const Feedback = require("../models/Feedback");
const User = require("../models/User");

// Customer submit feedback
exports.submitFeedback = async (req, res) => {
  try {
    const { rating_food, rating_service, recommendation, comment } = req.body;

    // Validation
    if (!rating_food || !rating_service || recommendation === undefined) {
      return res.status(400).json({ 
        message: "rating_food, rating_service, and recommendation are required" 
      });
    }

    if (rating_food < 1 || rating_food > 5) {
      return res.status(400).json({ message: "Food rating must be between 1 and 5" });
    }

    if (rating_service < 1 || rating_service > 5) {
      return res.status(400).json({ message: "Service rating must be between 1 and 5" });
    }

    if (recommendation < 0 || recommendation > 5) {
      return res.status(400).json({ message: "Recommendation must be between 0 and 5" });
    }

    // Check if user already submitted feedback (optional - one feedback per user)
    const existingFeedback = await Feedback.findOne({
      where: { userId: req.user.id }
    });

    if (existingFeedback) {
      return res.status(400).json({ 
        message: "You have already submitted feedback. You can update it instead." 
      });
    }

    const feedback = await Feedback.create({
      userId: req.user.id,
      rating_food,
      rating_service,
      recommendation,
      comment
    });

    // Return feedback with user info
    const feedbackWithUser = await Feedback.findByPk(feedback.id, {
      include: {
        model: User,
        attributes: ["id", "name", "email"]
      }
    });

    res.status(201).json({
      message: "Feedback submitted successfully",
      feedback: feedbackWithUser
    });

  } catch (error) {
    console.error("Submit feedback error:", error);
    res.status(500).json({ 
      message: "Server error while submitting feedback",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Admin view all feedback
exports.getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.findAll({
      include: {
        model: User,
        attributes: ["id", "name", "email"]
      },
      order: [['createdAt', 'DESC']]
    });

    res.json(feedbacks);

  } catch (error) {
    console.error("Get all feedback error:", error);
    res.status(500).json({ 
      message: "Server error while fetching feedback",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get user's own feedback
exports.getMyFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findOne({
      where: { userId: req.user.id },
      include: {
        model: User,
        attributes: ["id", "name", "email"]
      }
    });

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    res.json(feedback);

  } catch (error) {
    console.error("Get my feedback error:", error);
    res.status(500).json({ 
      message: "Server error while fetching feedback",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update user's feedback
exports.updateFeedback = async (req, res) => {
  try {
    const { rating_food, rating_service, recommendation, comment } = req.body;

    // Validation
    if (rating_food && (rating_food < 1 || rating_food > 5)) {
      return res.status(400).json({ message: "Food rating must be between 1 and 5" });
    }

    if (rating_service && (rating_service < 1 || rating_service > 5)) {
      return res.status(400).json({ message: "Service rating must be between 1 and 5" });
    }

    if (recommendation !== undefined && (recommendation < 0 || recommendation > 5)) {
      return res.status(400).json({ message: "Recommendation must be between 0 and 5" });
    }

    const feedback = await Feedback.findOne({
      where: { userId: req.user.id }
    });

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    // Update fields
    const updateData = {};
    if (rating_food !== undefined) updateData.rating_food = rating_food;
    if (rating_service !== undefined) updateData.rating_service = rating_service;
    if (recommendation !== undefined) updateData.recommendation = recommendation;
    if (comment !== undefined) updateData.comment = comment;

    await feedback.update(updateData);

    // Return updated feedback
    const updatedFeedback = await Feedback.findByPk(feedback.id, {
      include: {
        model: User,
        attributes: ["id", "name", "email"]
      }
    });

    res.json({
      message: "Feedback updated successfully",
      feedback: updatedFeedback
    });

  } catch (error) {
    console.error("Update feedback error:", error);
    res.status(500).json({ 
      message: "Server error while updating feedback",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete feedback (admin only)
exports.deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByPk(req.params.id);

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    await feedback.destroy();

    res.json({ message: "Feedback deleted successfully" });

  } catch (error) {
    console.error("Delete feedback error:", error);
    res.status(500).json({ 
      message: "Server error while deleting feedback",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
