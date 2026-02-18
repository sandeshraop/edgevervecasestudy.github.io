const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Cart = require("./Cart");
const MenuItem = require("./MenuItem");

const CartItem = sequelize.define("CartItem", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cartId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "cart_id"
  },
  menuItemId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "menu_item_id"
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 1
    }
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: "created_at"
  }
}, {
  tableName: "cart_items",
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ["cart_id", "menu_item_id"]
    }
  ]
});

/* ===========================
   Associations
=========================== */

Cart.hasMany(CartItem, {
  foreignKey: "cartId",
  onDelete: "CASCADE"
});

CartItem.belongsTo(Cart, {
  foreignKey: "cartId"
});

MenuItem.hasMany(CartItem, {
  foreignKey: "menuItemId",
  onDelete: "CASCADE"
});

CartItem.belongsTo(MenuItem, {
  foreignKey: "menuItemId"
});

module.exports = CartItem;
