const Product = require('../model/productmodel');
const User = require('../model/user');

const Review = require("../model/reviewmodel");

const getAllActiveProducts = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { status: "active" };
    if (category) {
      filter.category = { $regex: new RegExp(category, "i") };
    }

    const products = await Product.find(filter).populate("sellerId", "username");

    // Add average rating for each product
    const productsWithRating = await Promise.all(
      products.map(async (product) => {
        const ratings = await Review.find({ productId: product._id });
        const avgRating =
          ratings.reduce((sum, r) => sum + r.rating, 0) / (ratings.length || 1);
        return {
          ...product.toObject(),
          averageRating: avgRating.toFixed(1) // optional: 1 decimal
        };
      })
    );

    res.status(200).json(productsWithRating);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};


const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
  } catch (err) {
    console.error("Product fetch failed:", err);
    res.status(500).json({ message: 'Error fetching product' });
  }
};
const searchProducts = async(req,res)=>{
  const query = req.query.q || "";
  try {
    const products = await Product.find({
      productName: { $regex: query, $options: "i" } // case-insensitive match
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getAllActiveProducts,getProductById,searchProducts };
