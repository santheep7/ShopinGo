const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../model/ordermodel");
const Cart = require("../model/cartmodel");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET
});

exports.createOrder = async (req, res) => {
  try {
    const { paymentMethod, amount, products, shippingAddress } = req.body;
    const userId = req.user.id;

    if (paymentMethod === "COD") {
      // Directly create an order in DB without Razorpay
      const newOrder = new Order({
        userId,
        products: products.map(item => ({
          productId: item.productId._id || item.productId,
          quantity: item.quantity
        })),
        totalAmount: amount,
        shippingAddress,
        paymentMethod: "COD",
        status: "processing"
      });

      await newOrder.save();

      // Clear cart
      await Cart.findOneAndUpdate({ userId }, { items: [] });

      return res.status(201).json({ success: true, message: "COD order placed", order: newOrder });
    }

    // ✅ Razorpay path for online payments
    const options = {
      amount: amount * 100, // in paise
      currency: "INR",
      receipt: "receipt_" + new Date().getTime()
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json(order);

  } catch (err) {
    console.error("Create Order Error:", err);
    res.status(500).json({ message: "Failed to create order", error: err.message });
  }
};


exports.verifyAndSaveOrder = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      products,
      totalAmount,
      shippingAddress,
      paymentMethod,
    } = req.body;

    const userId = req.user.id; // ✅ extracted from token via `protect()` middleware

    // 🔐 Verify Razorpay Signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    // 💾 Save order in DB
    const newOrder = new Order({
      userId,
      products: products.map((item) => ({
        productId: item.productId._id || item.productId,
        quantity: item.quantity,
      })),
      totalAmount,
      shippingAddress,
      paymentMethod,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    await newOrder.save();

    // 🧹 Clear user's cart after successful payment
    await Cart.findOneAndUpdate({ userId }, { items: [] });

    return res.status(200).json({ success: true, message: "Order saved and cart cleared", order: newOrder });

  } catch (error) {
    console.error("Order Save Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

  exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate("products.productId", "name image") // 👈 must populate image + name
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error });
  }
};
// Cancel an order
exports.cancelOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId);

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.status === "delivered") {
      return res.status(400).json({ message: "Cannot cancel delivered order" });
    }

    order.status = "cancelled";
    await order.save();

    res.json({ message: "Order cancelled successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Error cancelling order", error });
  }
};
exports.hasPurchasedProduct = async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;

  try {
    const orders = await Order.find({ userId, "products.productId": productId });
    const purchased = orders.length > 0;
    res.json({ purchased });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};



