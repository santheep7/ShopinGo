import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AddProduct() {
  const [formData, setFormData] = useState({
    productName: '',
    productDescription: '',
    productPrice: '',
    category: '',
    productQuantity: '',
    brand: '',
    image: null,
  });

  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };
  const BASE_URL = import.meta.env.VITE_BASE_API_URL

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const data = new FormData();
    for (let key in formData) data.append(key, formData[key]);

    try {
      await axios.post(`${BASE_URL}/api/seller/add-product`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('✅ Product added successfully!');
      navigate('/Shome')
    } catch (err) {
      console.error(err);
      alert('❌ Error adding product');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">Add New Product</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Product Name</label>
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter product name"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="productDescription"
              value={formData.productDescription}
              onChange={handleChange}
              rows={4}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe the product"
              required
            ></textarea>
          </div>

          {/* Price and Quantity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
              <input
                type="number"
                name="productPrice"
                value={formData.productPrice}
                onChange={handleChange}
                min={0}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. 999"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Stock Quantity</label>
              <input
                type="number"
                name="productQuantity"
                value={formData.productQuantity}
                onChange={handleChange}
                min={0}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. 50"
                required
              />
            </div>
          </div>

          {/* Brand */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Brand</label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. Nike, Samsung"
            />
          </div>
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Category</option>
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion</option>
              <option value="Home Appliances">Home Appliances</option>
              <option value="Sports">Sports</option>
              <option value="Books">Books</option>
              <option value="Toys">Toys</option>
            </select>
          </div>


          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Product Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="inline-block w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-200"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
