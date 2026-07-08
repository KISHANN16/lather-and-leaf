import Order from '../models/Order.js';
import Product from '../models/Product.js';
import mongoose from 'mongoose';
import { fallbackDB } from '../config/fallbackDb.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    deliveryPrice,
    totalPrice,
  } = req.body;

  if (global.isUsingFallback || mongoose.connection.readyState !== 1) {
    try {
      if (orderItems && orderItems.length === 0) {
        return res.status(400).json({ message: 'No order items' });
      }

      const orderId = 'LL' + Math.floor(100000 + Math.random() * 900000);

      const createdOrder = fallbackDB.orders.create({
        user: req.user._id,
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        deliveryPrice,
        totalPrice,
        orderId,
        isPaid: paymentMethod !== 'cod',
      });

      // Update product stock levels
      for (const item of orderItems) {
        fallbackDB.products.updateStock(item.product, item.quantity);
      }

      return res.status(201).json(createdOrder);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  try {
    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // Generate custom tracking ID: LL + random 6 digits
    const orderId = 'LL' + Math.floor(100000 + Math.random() * 900000);

    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      deliveryPrice,
      totalPrice,
      orderId,
      isPaid: paymentMethod !== 'cod', // COD is unpaid initially, other simulated payments are paid
      paidAt: paymentMethod !== 'cod' ? new Date() : undefined,
    });

    const createdOrder = await order.save();

    // Update product stock levels
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock = Math.max(0, product.stock - item.quantity);
        await product.save();
      }
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  if (global.isUsingFallback || mongoose.connection.readyState !== 1) {
    try {
      const order = fallbackDB.orders.findById(req.params.id);

      if (order) {
        if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
          return res.status(403).json({ message: 'Access denied' });
        }
        return res.json(order);
      } else {
        return res.status(404).json({ message: 'Order not found' });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
      // Allow user who ordered or admin to view
      if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
      }
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  if (global.isUsingFallback || mongoose.connection.readyState !== 1) {
    try {
      const orders = fallbackDB.orders.find({ user: req.user._id });
      return res.json(orders);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (paginated)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  const page = Number(req.query.pageNumber) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  if (global.isUsingFallback || mongoose.connection.readyState !== 1) {
    try {
      const allOrders = fallbackDB.orders.find({});
      const count = allOrders.length;
      
      const totalRevenue = allOrders
        .filter(order => order.orderStatus !== 'Cancelled')
        .reduce((sum, order) => sum + order.totalPrice, 0);

      const orders = allOrders.slice(skip, skip + limit);

      return res.json({
        orders,
        page,
        pages: Math.ceil(count / limit) || 1,
        totalOrders: count,
        totalRevenue
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  try {
    const count = await Order.countDocuments({});
    const orders = await Order.find({})
      .populate('user', 'id name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const revenueData = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

    res.json({
      orders,
      page,
      pages: Math.ceil(count / limit) || 1,
      totalOrders: count,
      totalRevenue
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  if (global.isUsingFallback || mongoose.connection.readyState !== 1) {
    try {
      const updatedOrder = fallbackDB.orders.updateStatus(req.params.id, req.body.status);
      if (updatedOrder) {
        return res.json(updatedOrder);
      } else {
        return res.status(404).json({ message: 'Order not found' });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.orderStatus = req.body.status || order.orderStatus;
      
      if (req.body.status === 'Delivered') {
        order.isPaid = true; // Mark as paid if delivered
        order.paidAt = new Date();
      }

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Clear / Delete all orders (Admin utility)
// @route   DELETE /api/orders/clear
// @access  Private/Admin
const clearAllOrders = async (req, res) => {
  if (global.isUsingFallback || mongoose.connection.readyState !== 1) {
    try {
      fallbackDB.orders.clearAll();
      return res.json({ message: 'All orders cleared' });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  try {
    await Order.deleteMany({});
    res.json({ message: 'All orders cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  addOrderItems,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrderStatus,
  clearAllOrders,
};
