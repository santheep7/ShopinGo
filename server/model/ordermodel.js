const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, required: true }
    }
  ],
  totalAmount: {
    type: Number,
    required: true
  },
  shippingAddress: {
    type: String,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ["Online", "COD"],
    required: true
  },
  razorpay_order_id: String,
  razorpay_payment_id: String,
  razorpay_signature: String,

   status: {
    type: String,
    enum: ["processing", "shipped", "delivered", "cancelled"],
    default: "processing"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Order", orderSchema);
