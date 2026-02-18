const Category = require("../models/Category");

// Admin - Add Category
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.create({ name });
    
    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category
    });
  } catch (error) {
    console.error("Create category error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error while creating category" 
    });
  }
};

// Public - Get All Categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    
    res.json({
      success: true,
      categories
    });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error while fetching categories" 
    });
  }
};
