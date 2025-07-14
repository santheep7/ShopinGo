import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  PencilIcon,
  TrashIcon,
  StarIcon,
  BadgeCheckIcon,
  XCircleIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';


export default function ViewProducts() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchSellerProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:9000/api/seller/my-products', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchSellerProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:9000/api/seller/delete-product/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.filter((product) => product._id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">🛍️ Your Products</h2>

      {products.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-xl shadow-md overflow-hidden transition hover:shadow-lg"
            >
              <img
                src={product.image?.startsWith('http') ? product.image : `http://localhost:9000/uploads/${product.image}`}
                alt={product.productName}
                className="h-48 w-full object-cover"
              />

              <div className="p-5 space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-gray-800">{product.productName}</h3>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${product.status === 'active'
                      ? 'bg-green-100 text-green-600'
                      : 'bg-red-100 text-red-600'
                      }`}
                  >
                    {product.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 line-clamp-2">{product.productDescription}</p>

                <div className="text-sm text-gray-600">
                  <span className="font-medium">Brand:</span> {product.brand || 'N/A'}
                </div>

                <div className="flex justify-between mt-2">
                  <div className="text-gray-800 font-semibold text-base">
                    ₹{product.productPrice}
                  </div>
                  <div className="text-sm text-gray-500">
                    Qty: <span className="font-semibold">{product.productQuantity}</span>
                  </div>
                </div>

                <div className="flex items-center text-sm text-yellow-500">
                  <StarIcon className="w-4 h-4 mr-1" />
                  {product.rating || 0}
                </div>

                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => navigate(`/updateproduct/${product._id}`)}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <PencilIcon className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm"
                  >
                    <TrashIcon className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
