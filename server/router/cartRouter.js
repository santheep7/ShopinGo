const express = require('express');
const { getCart, addToCart, removeFromCart } = require('../controller/cartControl');
const { protect } = require('../auth/jwtauthentiaction') 

const cartRoute = express.Router();

cartRoute.get('/get-cart',protect(['user']),getCart)
cartRoute.post('/add-cart',protect(['user']),addToCart)
cartRoute.delete('/del-cart',protect(['user']),removeFromCart)

module.exports = cartRoute;