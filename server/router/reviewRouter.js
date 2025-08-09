const express = require("express");
const Reviewrouter = express.Router();
const { addReview, getReviewsForProduct } = require("../controller/reviewController");
const { protect } = require("../auth/jwtauthentiaction");

Reviewrouter.post("/add", protect(["user"]), addReview);
Reviewrouter.get("/:productId", getReviewsForProduct);

module.exports = Reviewrouter;
