const express = require('express');
const { getAllActiveProducts, getProductById, searchProducts } = require('../controller/productControl');
const productRouter = express.Router();


productRouter.get('/products', getAllActiveProducts); // public route for users
productRouter.get('/product/:id', getProductById);
productRouter.get('/search',searchProducts)
module.exports = productRouter;
