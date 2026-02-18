const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const Order = sequelize.define("Order", {
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

  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: "total_amount",
    validate: {
      min: 0
    }
  },

  tax: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    validate: {
      min: 0
    }
  },

  discount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    validate: {
      min: 0
    }
  },

  status: {
    type: DataTypes.ENUM("pending", "preparing", "delivered", "cancelled"),
    defaultValue: "pending"
  },

  paymentMethod: {
    type: DataTypes.ENUM("card", "netbanking", "cod"),
    allowNull: true,
    field: "payment_method"
  },

  paymentStatus: {
    type: DataTypes.ENUM("pending", "paid", "failed"),
    defaultValue: "pending",
    field: "payment_status"
  },

  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: "created_at"
  }

}, {
  tableName: "orders",
  timestamps: false
});

/* ===========================
   Associations
=========================== */

User.hasMany(Order, {
  foreignKey: "userId",
  onDelete: "CASCADE"
});

Order.belongsTo(User, {
  foreignKey: "userId"
});

module.exports = Order;
