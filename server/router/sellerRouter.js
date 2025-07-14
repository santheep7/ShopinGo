const express = require('express');
const upload = require('../middleware/upload');
const sellerRoute = express.Router();
const { protect } = require('../auth/jwtauthentiaction') 

const { addProduct, getSellerProducts, updateProductBySeller, deleteProductBySeller } = require('../controller/sellerController');
sellerRoute.post('/add-product', protect(['seller']), upload.single('image'), addProduct);
sellerRoute.get('/my-products', protect(['seller']), getSellerProducts);
sellerRoute.put('/update-product/:id', protect(['seller']), upload.single('image'), updateProductBySeller);
sellerRoute.delete('/delete-product/:id', protect(['seller']), deleteProductBySeller);

module.exports = sellerRoute;
