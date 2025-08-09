import React, { useEffect, useState } from "react";
import axios from "axios";
import Footer from "../../common/footer";
import UserNavbar from "./navbar";
import { useNavigate } from "react-router-dom";

export default function UserHome() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const BASE_URL = import.meta.env.VITE_BASE_API_URL
const navigate = useNavigate();
  const fetchAllProducts = async (categoryName = "", search = "") => {
    try {
      const endpoint = search
        ? `${BASE_URL}/api/product/search?q=${search}`
        : `${BASE_URL}/api/product/products`;

      const res = await axios.get(endpoint, {
        params: search ? {} : { category: categoryName },
      });

      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    if (searchTerm.trim() !== "") {
      fetchAllProducts("", searchTerm);
    } else {
      fetchAllProducts(category);
    }
  }, [searchTerm, category]);

  const handleCategoryClick = (cat) => {
    if (category === cat) {
      setCategory("");
      fetchAllProducts("");
    } else {
      setCategory(cat);
      fetchAllProducts(cat);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${BASE_URL}/api/cart/add`,
        {
          productId,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Item added to cart!");
    } catch (err) {
      console.error("Add to cart error:", err);
      alert("Failed to add item. Please login.");
    }
  };

  return (
    <>
      <UserNavbar searchquery={setSearchTerm} />

      <div className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <div className="relative w-full h-64 sm:h-80 md:h-[400px] bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">Welcome to ShopinGO 🛍️</h1>
            <p className="text-sm sm:text-base">Discover the best deals from trusted sellers</p>
          </div>
        </div>

        {/* Categories */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Top Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {["Electronics", "Fashion", "Home", "Gadgets"].map((cat) => (
              <div
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`bg-white shadow p-4 rounded-lg text-center hover:shadow-lg cursor-pointer transition ${
                  category === cat ? "border-2 border-blue-600" : ""
                }`}
              >
                <p className="font-medium">{cat}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Featured Products</h2>
          {products.length === 0 ? (
            <p className="text-gray-500">No products available.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/ProductDetails/${product._id}`)}
                >
                  <img
                    src={
                      product.image?.startsWith("http")
                        ? product.image
                        : `${BASE_URL}/uploads/${product.image}`
                    }
                    alt={product.productName}
                    className="h-48 w-full object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 truncate">{product.productName}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2">{product.productDescription}</p>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-green-600 font-bold">₹{product.productPrice}</span>
                      <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`text-sm ${i < Math.round(product.averageRating) ? "text-yellow-500" : "text-gray-300"}`}>
                            ★
                          </span>
                        ))}
                        <span className="ml-2 text-xs text-gray-500">({product.averageRating || 0})</span>
                      </div>
                      <span className="text-xs text-gray-400">Qty: {product.productQuantity}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // prevent navigation on button click
                        handleAddToCart(product._id);
                      }}
                      className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
}
