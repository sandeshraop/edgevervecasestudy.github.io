const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const Reservation = sequelize.define("Reservation", {
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

  reservationDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: "reservation_date"
  },

  reservationTime: {
    type: DataTypes.TIME,
    allowNull: false,
    field: "reservation_time"
  },

  numberOfPersons: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "number_of_persons",
    validate: {
      min: 1
    }
  },

  specialRequest: {
    type: DataTypes.TEXT,
    field: "special_request"
  },

  status: {
    type: DataTypes.ENUM("pending", "confirmed", "cancelled"),
    defaultValue: "pending"
  },

  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: "created_at"
  }

}, {
  tableName: "reservations",
  timestamps: false,
  indexes: [
    {
      fields: ["user_id"]
    }
  ]
});

/* ===========================
   Associations
=========================== */

User.hasMany(Reservation, {
  foreignKey: "userId",
  onDelete: "CASCADE"
});

Reservation.belongsTo(User, {
  foreignKey: "userId"
});

module.exports = Reservation;
