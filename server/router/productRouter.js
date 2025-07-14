const express = require('express');
const { getAllActiveProducts } = require('../controller/productControl');
const productRouter = express.Router();


productRouter.get('/products', getAllActiveProducts); // public route for users

module.exports = productRouter;
