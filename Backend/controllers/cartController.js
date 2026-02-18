const Cart = require("../models/Cart");
const CartItem = require("../models/CartItem");
const MenuItem = require("../models/MenuItem");

// Add item to cart
exports.addToCart = async (req, res) => {
  try {
    const { menuItemId, quantity } = req.body;

    // Validation
    if (!menuItemId || !quantity || quantity < 1) {
      return res.status(400).json({ message: "Valid menuItemId and quantity are required" });
    }

    // Check if menu item exists and is available
    const menuItem = await MenuItem.findByPk(menuItemId);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    if (!menuItem.isAvailable) {
      return res.status(400).json({ message: "Menu item is not available" });
    }

    // Get or create user's cart
    let cart = await Cart.findOne({ where: { userId: req.user.id } });
    if (!cart) {
      cart = await Cart.create({ userId: req.user.id });
    }

    // Check if item already exists in cart
    const existingItem = await CartItem.findOne({
      where: { cartId: cart.id, menuItemId }
    });

    if (existingItem) {
      existingItem.quantity += quantity;
      await existingItem.save();
    } else {
      await CartItem.create({
        cartId: cart.id,
        menuItemId,
        quantity
      });
    }

    // Return updated cart
    const updatedCart = await Cart.findOne({
      where: { userId: req.user.id },
      include: {
        model: CartItem,
        include: MenuItem
      }
    });

    res.json({
      message: "Item added to cart successfully",
      cart: updatedCart
    });

  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ 
      message: "Server error while adding item to cart",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// View cart
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      where: { userId: req.user.id },
      include: {
        model: CartItem,
        include: MenuItem
      }
    });

    if (!cart) {
      return res.json({ 
        message: "Cart is empty",
        cart: null
      });
    }

    // Calculate total
    const total = cart.CartItems.reduce((sum, item) => {
      return sum + (item.quantity * item.MenuItem.price);
    }, 0);

    res.json({
      cart,
      total: parseFloat(total.toFixed(2))
    });

  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ 
      message: "Server error while fetching cart",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update cart item quantity
exports.updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const cartItem = await CartItem.findByPk(req.params.id, {
      include: [{
        model: Cart,
        where: { userId: req.user.id }
      }]
    });

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    res.json({
      message: "Cart item updated successfully",
      cartItem
    });

  } catch (error) {
    console.error("Update cart item error:", error);
    res.status(500).json({ 
      message: "Server error while updating cart item",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Remove item from cart
exports.removeCartItem = async (req, res) => {
  try {
    const cartItem = await CartItem.findByPk(req.params.id, {
      include: [{
        model: Cart,
        where: { userId: req.user.id }
      }]
    });

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    await cartItem.destroy();

    res.json({ message: "Item removed from cart successfully" });

  } catch (error) {
    console.error("Remove cart item error:", error);
    res.status(500).json({ 
      message: "Server error while removing cart item",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ where: { userId: req.user.id } });
    
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    await CartItem.destroy({ where: { cartId: cart.id } });

    res.json({ message: "Cart cleared successfully" });

  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({ 
      message: "Server error while clearing cart",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
