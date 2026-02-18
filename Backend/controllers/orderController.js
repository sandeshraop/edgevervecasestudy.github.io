const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const User = require("../models/User");
const MenuItem = require("../models/MenuItem");

// Place Order
exports.placeOrder = async (req, res) => {
  try {
    const { items, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let totalAmount = 0;
    const orderItems = [];

    // Validate items and calculate total
    for (const item of items) {
      if (!item.menuItemId || !item.quantity || item.quantity < 1) {
        return res.status(400).json({ message: "Invalid item data" });
      }

      const menuItem = await MenuItem.findByPk(item.menuItemId);
      if (!menuItem) {
        return res.status(404).json({ message: `Menu item not found: ${item.menuItemId}` });
      }

      if (!menuItem.isAvailable) {
        return res.status(400).json({ message: `Menu item not available: ${menuItem.name}` });
      }

      const itemTotal = menuItem.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        price: menuItem.price
      });
    }

    // Create order
    const order = await Order.create({
      userId: req.user.id,
      totalAmount,
      paymentMethod: paymentMethod || 'cod',
      paymentStatus: "pending",
      status: "pending"
    });

    // Create order items
    for (const itemData of orderItems) {
      await OrderItem.create({
        orderId: order.id,
        menuItemId: itemData.menuItemId,
        quantity: itemData.quantity,
        price: itemData.price
      });
    }

    // Get complete order with details
    const completeOrder = await Order.findByPk(order.id, {
      include: [
        {
          model: OrderItem,
          include: [MenuItem]
        },
        {
          model: User,
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    res.status(201).json({
      message: "Order placed successfully",
      order: completeOrder
    });

  } catch (error) {
    console.error("Place order error:", error);
    res.status(500).json({ 
      message: "Server error while placing order",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// My Orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: OrderItem,
          include: [MenuItem]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(orders);

  } catch (error) {
    console.error("Get my orders error:", error);
    res.status(500).json({ 
      message: "Server error while fetching orders",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Admin View All Orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: OrderItem,
          include: [MenuItem]
        },
        {
          model: User,
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(orders);

  } catch (error) {
    console.error("Get all orders error:", error);
    res.status(500).json({ 
      message: "Server error while fetching all orders",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Admin Update Status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["pending", "preparing", "delivered", "cancelled"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await order.update({ status });

    res.json({
      message: "Order status updated successfully",
      order
    });

  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({ 
      message: "Server error while updating order status",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update Payment Status
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const validStatuses = ["pending", "paid", "failed"];

    if (!validStatuses.includes(paymentStatus)) {
      return res.status(400).json({ message: "Invalid payment status" });
    }

    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await order.update({ paymentStatus });

    res.json({
      message: "Payment status updated successfully",
      order
    });

  } catch (error) {
    console.error("Update payment status error:", error);
    res.status(500).json({ 
      message: "Server error while updating payment status",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Cancel Order
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status === 'delivered') {
      return res.status(400).json({ message: "Cannot cancel delivered order" });
    }

    if (order.status === 'cancelled') {
      return res.status(400).json({ message: "Order is already cancelled" });
    }

    await order.update({ status: 'cancelled' });

    res.json({
      message: "Order cancelled successfully",
      order
    });

  } catch (error) {
    console.error("Cancel order error:", error);
    res.status(500).json({ 
      message: "Server error while cancelling order",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
