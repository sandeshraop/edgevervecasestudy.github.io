const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Order = require("./Order");
const MenuItem = require("./MenuItem");

const OrderItem = sequelize.define("OrderItem", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "order_id"
  },

  menuItemId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "menu_item_id"
  },

  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },

  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },

  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: "created_at"
  }

}, {
  tableName: "order_items",
  timestamps: false,
  indexes: [
    {
      fields: ["order_id"]
    },
    {
      fields: ["menu_item_id"]
    }
  ]
});

/* ===========================
   Associations
=========================== */

Order.hasMany(OrderItem, {
  foreignKey: "orderId",
  onDelete: "CASCADE"
});

OrderItem.belongsTo(Order, {
  foreignKey: "orderId"
});

MenuItem.hasMany(OrderItem, {
  foreignKey: "menuItemId",
  onDelete: "CASCADE"
});

OrderItem.belongsTo(MenuItem, {
  foreignKey: "menuItemId"
});

module.exports = OrderItem;
