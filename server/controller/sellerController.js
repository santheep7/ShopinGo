const Product = require('../model/productmodel');
// 1. Add product (with multer image)
const addProduct = async (req, res) => {
  try {
    const { productName, productDescription, productPrice, productQuantity, brand } = req.body;
    const image = req.file?.filename || 'default.jpg';

    const sellerId = req.user.id; // Assuming you use protect middleware

    const product = new Product({
      productName,
      productDescription,
      productPrice,
      productQuantity,
      brand,
      image,
      sellerId
    });

    await product.save();
    res.status(201).json({ message: "Product added successfully", product });
  } catch (err) {
    console.error("Add Product Error:", err);
    res.status(500).json({ message: "Failed to add product" });
  }
};

// 2. Get all products by the logged-in seller
const getSellerProducts = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const products = await Product.find({ sellerId });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products" });
  }
};

// 3. Update product by seller
const updateProductBySeller = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, sellerId: req.user.id });

    if (!product) return res.status(404).json({ message: "Product not found or unauthorized" });

    const updates = req.body;
    if (req.file) updates.image = req.file.filename;

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json({ message: "Product updated", updatedProduct });
  } catch (err) {
    res.status(500).json({ message: "Error updating product" });
  }
};

// 4. Delete product by seller
const deleteProductBySeller = async (req, res) => {
  try {
    const deleted = await Product.findOneAndDelete({ _id: req.params.id, sellerId: req.user.id });
    if (!deleted) return res.status(404).json({ message: "Product not found or unauthorized" });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting product" });
  }
};

module.exports = {
  addProduct,
  getSellerProducts,
  updateProductBySeller,
  deleteProductBySeller
};
