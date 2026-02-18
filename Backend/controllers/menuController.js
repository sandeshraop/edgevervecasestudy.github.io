const MenuItem = require("../models/MenuItem");
const Category = require("../models/Category");

// Admin - Add Menu Item
exports.createMenuItem = async (req, res) => {
  try {
    const { name, description, price, imageUrl, categoryId } = req.body;

    const item = await MenuItem.create({
      name,
      description,
      price,
      imageUrl,
      categoryId
    });

    res.status(201).json({
      success: true,
      message: "Menu item created successfully",
      item
    });
  } catch (error) {
    console.error("Create menu item error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error while creating menu item" 
    });
  }
};

// Public - Get All Menu Items (with category)
exports.getMenuItems = async (req, res) => {
  try {
    const items = await MenuItem.findAll({
      include: Category
    });
    
    res.json({
      success: true,
      items
    });
  } catch (error) {
    console.error("Get menu items error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error while fetching menu items" 
    });
  }
};

// Public - Filter by Category
exports.getMenuByCategory = async (req, res) => {
  try {
    const items = await MenuItem.findAll({
      where: { categoryId: req.params.categoryId },
      include: Category
    });
    
    res.json({
      success: true,
      items
    });
  } catch (error) {
    console.error("Get menu by category error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error while fetching menu items by category" 
    });
  }
};

// Admin - Update Menu Item
exports.updateMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByPk(req.params.id);

    if (!item) {
      return res.status(404).json({ 
        success: false,
        message: "Item not found" 
      });
    }

    // Safe field updates only
    const { name, description, price, imageUrl, categoryId, isAvailable } = req.body;

    await item.update({
      name,
      description,
      price,
      imageUrl,
      categoryId,
      isAvailable
    });

    res.json({
      success: true,
      message: "Menu item updated successfully",
      item
    });
  } catch (error) {
    console.error("Update menu item error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error while updating menu item" 
    });
  }
};

// Admin - Delete Menu Item
exports.deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByPk(req.params.id);

    if (!item) {
      return res.status(404).json({ 
        success: false,
        message: "Item not found" 
      });
    }

    await item.destroy();
    
    res.json({
      success: true,
      message: "Menu item deleted successfully"
    });
  } catch (error) {
    console.error("Delete menu item error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error while deleting menu item" 
    });
  }
};
