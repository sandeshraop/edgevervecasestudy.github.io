const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Category = require("./Category");

const MenuItem = sequelize.define("MenuItem", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  name: {
    type: DataTypes.STRING(150),
    allowNull: false
  },

  description: {
    type: DataTypes.TEXT
  },

  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },

  imageUrl: {
    type: DataTypes.STRING(255),
    field: "image_url"
  },

  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "category_id"
  },

  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },

  isAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: "is_available"
  },

  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: "created_at"
  }

}, {
  tableName: "menu_items",
  timestamps: false
});

/* ===========================
   Associations
=========================== */

Category.hasMany(MenuItem, {
  foreignKey: "categoryId",
  onDelete: "CASCADE"
});

MenuItem.belongsTo(Category, {
  foreignKey: "categoryId"
});

module.exports = MenuItem;
