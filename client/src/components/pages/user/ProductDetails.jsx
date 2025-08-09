import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

export default function ProductDetails() {
  const { id } = useParams(); // product ID from URL
  const [product, setProduct] = useState(null);
  const [purchased, setPurchased] = useState(false);
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_API_URL

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await axios.get(`${BASE_URL}/api/product/product/${id}`);

      setProduct(res.data);
    };

    const checkIfPurchased = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BASE_URL}/api/order/hasPurchased/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPurchased(res.data.purchased);
    };

    fetchProduct();
    checkIfPurchased();
  }, [id]);

  if (!product) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">{product.productName}</h1>
      <img src={`${BASE_URL}/uploads/${product.image}`} className="w-full h-80 object-cover rounded-lg" alt="" />
      <p className="mt-4 text-gray-700">{product.productDescription}</p>
      <p className="mt-2 text-lg font-semibold text-green-600">₹{product.productPrice}</p>

      {purchased && (
        <button
          onClick={() => navigate(`/product/${id}/review`)}
          className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Write a Review
        </button>
      )}
    </div>
  );
}
