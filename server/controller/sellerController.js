const Product = require('../model/productmodel');
const User = require('../model/user');
const Order = require('../model/ordermodel');

// 1. Add product
const addProduct = async (req, res) => {
  try {
    const { productName, productPrice, productDescription } = req.body;

    if (!req.file) return res.status(400).json({ message: 'Product image is required' });

    const product = new Product({
      productName,
      productPrice,
      productDescription,
      sellerId: req.user.id,
      image: req.file.filename
    });

    await product.save();
    res.status(201).json({ message: 'Product added successfully', product });
  } catch (err) {
    console.error("Error in addProduct:", err);
    res.status(500).json({ message: "Failed to add product" });
  }
};

// 2. Get all products by this seller
const getSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({ sellerId: req.user.id });
    res.json(products);
  } catch (err) {
    console.error("Error in getSellerProducts:", err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

// 3. Update product by seller
const updateProductBySeller = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (req.file) {
      updates.image = req.file.filename;
    }

    const product = await Product.findOneAndUpdate(
      { _id: id, sellerId: req.user.id },
      updates,
      { new: true }
    );

    if (!product) return res.status(404).json({ message: 'Product not found or unauthorized' });

    res.json({ message: 'Product updated', product });
  } catch (err) {
    console.error("Error in updateProductBySeller:", err);
    res.status(500).json({ message: "Failed to update product" });
  }
};

// 4. Delete product by seller
const deleteProductBySeller = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Product.findOneAndDelete({ _id: id, sellerId: req.user.id });

    if (!deleted) return res.status(404).json({ message: 'Product not found or unauthorized' });

    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error("Error in deleteProductBySeller:", err);
    res.status(500).json({ message: "Failed to delete product" });
  }
};

// 5. Seller profile view
const Profile = async (req, res) => {
  try {
    const seller = await User.findById(req.user.id).select('-password');

    if (!seller || seller.role !== 'seller') {
      return res.status(404).json({ message: 'Seller not found' });
    }

    res.json({
      username: seller.username || "Not provided",
      email: seller.email,
      phone: seller.phone || "Not provided",
      company: seller.company || "No company info",
      status: seller.status || 'pending',
      createdAt: seller.createdAt,
      role: seller.role
    });
  } catch (err) {
    console.error("Error in Profile:", err);
    res.status(500).json({ message: "Failed to load profile" });
  }
};

const getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.user.id;

    const orders = await Order.find()
      .populate('userId', 'name email')
      .populate({
        path: 'products.productId',
        model: 'Product',
        select: 'productName image productPrice sellerId'
      });

    const sellerOrders = orders.map(order => {
      const filteredProducts = order.products.filter(p =>
        p.productId && p.productId.sellerId.toString() === sellerId
      );

      if (filteredProducts.length === 0) return null;

      return {
        _id: order._id,
        user: order.userId,
        products: filteredProducts.map(p => ({
          productId: p.productId._id,
          productName: p.productId.productName,
          image: p.productId.image,
          price: p.productId.productPrice,
          quantity: p.quantity,
          status: p.status
        })),
        totalAmount: order.totalAmount,
        paymentMethod: order.paymentMethod,
        shippingAddress: order.shippingAddress,
        createdAt: order.createdAt
      };
    }).filter(Boolean);

    res.json(sellerOrders);
  } catch (err) {
    console.error("Error in getSellerOrders:", err);
    res.status(500).json({ message: "Error fetching seller orders" });
  }
};

// 2. Update order status of a product (only seller’s own product)
const updateProductOrderStatus = async (req, res) => {
  const { orderId, productId, status } = req.body;

  if (!['processing', 'shipping', 'delivered'].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const order = await Order.findById(orderId).populate('products.productId');

    if (!order) return res.status(404).json({ message: "Order not found" });

    const productInOrder = order.products.find(p =>
      p.productId &&
      p.productId._id.toString() === productId &&
      p.productId.sellerId.toString() === req.user.id
    );

    if (!productInOrder) {
      return res.status(403).json({ message: "Unauthorized to update this product status" });
    }

    if (productInOrder.status === 'cancelled') {
      return res.status(400).json({ message: "Cannot update status of a cancelled product" });
    }

    productInOrder.status = status;
    await order.save();

    res.json({ message: "Product status updated successfully" });
  } catch (err) {
    console.error("Error in updateProductOrderStatus:", err);
    res.status(500).json({ message: "Failed to update product status" });
  }
};


module.exports = {
  addProduct,
  getSellerProducts,
  updateProductBySeller,
  deleteProductBySeller,
  Profile,
  getSellerOrders,
  updateProductOrderStatus
};
