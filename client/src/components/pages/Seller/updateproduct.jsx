import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    productName: "",
    productDescription: "",
    productPrice: "",
    category:'',
    productQuantity: "",
    brand: "",
    status: "active",
    image: null,
  });

  const [previewImage, setPreviewImage] = useState("");
  const BASE_URL = import.meta.env.VITE_BASE_API_URL

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${BASE_URL}/api/seller/my-products`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const product = res.data.find((p) => p._id === id);
        if (product) {
          setFormData({
            productName: product.productName,
            productDescription: product.productDescription,
            productPrice: product.productPrice,
            productQuantity: product.productQuantity,
            category:product.category,
            brand: product.brand,
            status: product.status || "active",
            image: null,
          });
          setPreviewImage(product.image);

        }
      } catch (err) {
        console.error("Error loading product:", err);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const data = new FormData();
    for (let key in formData) {
      if (formData[key] !== null) {
        data.append(key, formData[key]);
      }
    }

    try {
      await axios.put(`${BASE_URL}/api/seller/update-product/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Product updated!");
      navigate("/myproducts");
    } catch (err) {
      console.error("Update error:", err);
      alert("Error updating product");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Product</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Product Name</label>
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-300"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea
              name="productDescription"
              value={formData.productDescription}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-300"
              required
            />
          </div>
           <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea
              name="category"
              value={formData.category}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-300"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Price (₹)</label>
              <input
                type="number"
                name="productPrice"
                value={formData.productPrice}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Quantity</label>
              <input
                type="number"
                name="productQuantity"
                value={formData.productQuantity}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2 rounded-md"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1">Brand</label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-md"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-md"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">Image</label>
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                className="w-32 h-32 object-cover rounded border mb-2"
              />
            )}
            <input
              type="file"
              name="image"
              onChange={handleFileChange}
              className="w-full"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md"
          >
            Update Product
          </button>
        </form>
      </div>
    </div>
  );
}
