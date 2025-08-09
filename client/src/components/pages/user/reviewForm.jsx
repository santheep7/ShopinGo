import React, { useState } from "react";
import axios from "axios";

export default function ReviewForm({ productId, onReviewSubmitted }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const BASE_URL = import.meta.env.VITE_BASE_API_URL

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `${BASE_URL}/api/review/add`,
        { productId, rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Review submitted");
      onReviewSubmitted(); // to refresh product or reviews
      setRating(0);
      setComment("");
    } catch (err) {
      alert(err.response?.data?.message || "Error submitting review");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow mt-4">
      <div className="flex space-x-1 mb-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`cursor-pointer text-2xl ${star <= rating ? "text-yellow-500" : "text-gray-300"}`}
            onClick={() => setRating(star)}
          >
            ★
          </span>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your review..."
        className="w-full border rounded p-2"
        rows="3"
      ></textarea>
      <button
        type="submit"
        className="mt-2 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Submit Review
      </button>
    </form>
  );
}
