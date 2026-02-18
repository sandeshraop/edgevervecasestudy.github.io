const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const Cart = sequelize.define("Cart", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    field: "user_id"
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: "created_at"
  }
}, {
  tableName: "carts",
  timestamps: false
});

/* ===========================
   Associations
=========================== */

User.hasOne(Cart, {
  foreignKey: "userId",
  onDelete: "CASCADE"
});

Cart.belongsTo(User, {
  foreignKey: "userId"
});

module.exports = Cart;
