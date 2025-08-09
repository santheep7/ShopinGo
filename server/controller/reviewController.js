const Review = require("../model/reviewmodel");

const Order = require("../model/ordermodel");

exports.addReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user.id;

    // Check if user already reviewed
    const existing = await Review.findOne({ productId, userId });
    if (existing) {
      return res.status(400).json({ message: "You already reviewed this product." });
    }

    // ✅ Check if user purchased this product
    const purchased = await Order.findOne({
      userId,
      "products.productId": productId,
    });

    if (!purchased) {
      return res.status(403).json({
        message: "You can only review products you've purchased.",
      });
    }

    const review = new Review({ productId, userId, rating, comment });
    await review.save();

    res.status(201).json({ message: "Review added successfully." });
  } catch (err) {
    console.error("Review error:", err);
    res.status(500).json({ message: "Failed to add review" });
  }
};

exports.getReviewsForProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ productId }).populate("userId", "username");
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};
