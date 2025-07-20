const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
    trim: true
  },

  productDescription: {
    type: String,
    required: true
  },
  productPrice: {
    type: Number,
    required: true,
    min: 0
  },
  productQuantity: {
    type: Number,
    required: true,
    trim: true
  },
  category:
    { type: String, }, // ✅ category required

  brand: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    required: true
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  rating: {
    type: Number,
    defualt: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
});
module.exports = mongoose.model('Product', productSchema);