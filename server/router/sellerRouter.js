const express = require('express');
const upload = require('../middleware/upload'); // multer with memoryStorage
const sellerRoute = express.Router();
const { protect } = require('../auth/jwtauthentiaction');

const {
  addProduct,
  getSellerProducts,
  updateProductBySeller,
  deleteProductBySeller,
  Profile,
  getSellerOrders,
  updateProductOrderStatus
} = require('../controller/sellerController');

// Add a new product
sellerRoute.post(
  '/add-product',
  protect(['seller']),
  upload.single('image'), // Cloudinary will use req.file.buffer
  addProduct
);

// Get all products for this seller
sellerRoute.get(
  '/my-products',
  protect(['seller']),
  getSellerProducts
);

// Update a product
sellerRoute.put(
  '/update-product/:id',
  protect(['seller']),
  upload.single('image'), // If new image provided, Cloudinary upload will happen
  updateProductBySeller
);

// Delete a product
sellerRoute.delete(
  '/delete-product/:id',
  protect(['seller']),
  deleteProductBySeller
);

// Seller profile
sellerRoute.get(
  '/profile',
  protect(['seller']),
  Profile
);

// Get orders for seller
sellerRoute.get(
  '/getorder',
  protect(['seller']),
  getSellerOrders
);

// Update product order status
sellerRoute.patch(
  '/updatestatus',
  protect(['seller']),
  updateProductOrderStatus
);

module.exports = sellerRoute;
