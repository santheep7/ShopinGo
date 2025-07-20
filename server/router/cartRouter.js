const express = require("express");
const cartrouter = express.Router();
const cartController = require("../controller/cartControl");
const { protect } = require("../auth/jwtauthentiaction"); // adjust path if needed

cartrouter.post("/add", protect(),cartController.addToCart);
cartrouter.get("/get", protect(),cartController.getCart);
cartrouter.delete("/remove/:productId", protect(), cartController.removeFromCart);
cartrouter.delete("/clear", protect(), cartController.clearCart);

module.exports = cartrouter;
