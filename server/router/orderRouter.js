const express = require("express");
const checkoutrouter = express.Router();
const { createOrder, verifyAndSaveOrder, getUserOrders, cancelOrder, hasPurchasedProduct } = require("../controller/OrderControl");
const { protect } = require("../auth/jwtauthentiaction");

checkoutrouter.post("/create", protect(), createOrder);
checkoutrouter.post("/verify", protect(), verifyAndSaveOrder);
checkoutrouter.get("/user", protect(),getUserOrders);
checkoutrouter.put("/cancel/:orderId", protect(), cancelOrder);
checkoutrouter.get('/hasPurchased/:productId', protect(['user']), hasPurchasedProduct);

module.exports = checkoutrouter;
