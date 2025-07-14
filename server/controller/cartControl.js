// controllers/cartController.js
const Cart = require("../model/cartmodel");
const Product = require("../model/productmodel");

// Add item to cart
const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [{ productId, quantity }] });
    } else {
      const index = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );
      if (index >= 0) {
        cart.items[index].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
    }

    await cart.save();
    res.status(200).json({ message: "Item added to cart", cart });
  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get cart with populated product info
const getCart = async (req, res) => {
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart) return res.json([]);

    const cartItems = cart.items.map((item) => {
      const product = item.productId;
      return {
        _id: product._id,
        productName: product.productName,
        productPrice: product.productPrice,
        image: product.image,
        productQuantity: product.productQuantity,
        selectedQuantity: item.quantity,
        brand: product.brand,
        category: product.category,
      };
    });

    res.status(200).json(cartItems);
  } catch (err) {
    console.error("Get cart error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;

  try {
    await Cart.findOneAndUpdate(
      { userId },
      { $pull: { items: { productId } } }
    );

    res.status(200).json({ message: "Item removed" });
  } catch (err) {
    console.error("Remove cart item error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = {getCart,addToCart,removeFromCart}
