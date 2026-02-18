const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const Feedback = sequelize.define("Feedback", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "user_id"
  },
  ratingFood: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    },
    field: "rating_food"
  },
  ratingService: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    },
    field: "rating_service"
  },
  recommendation: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 5
    }
  },
  comment: {
    type: DataTypes.TEXT
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: "created_at"
  }
}, {
  tableName: "feedback",
  timestamps: false
});

/* ===========================
   Associations
=========================== */

User.hasMany(Feedback, {
  foreignKey: "userId",
  onDelete: "CASCADE"
});

Feedback.belongsTo(User, {
  foreignKey: "userId"
});

module.exports = Feedback;
