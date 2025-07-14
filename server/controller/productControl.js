const Product = require('../model/productmodel')
const getAllActiveProducts = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { status: "active" };
    if (category) {
      filter.category = category; // ✅ Filter by category
    }

    const products = await Product.find(filter).populate("sellerId", "username");
    res.status(200).json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};
module.exports= {getAllActiveProducts}
