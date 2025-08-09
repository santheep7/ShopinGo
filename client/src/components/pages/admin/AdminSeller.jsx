import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Store, Trash2, CheckCircle } from 'lucide-react';
import gsap from 'gsap';

export default function AdminViewSellers() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const rowRefs = useRef([]);

  const fetchSellers = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:9000/api/admin/getadmin-seller', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSellers(res.data);
    } catch (err) {
      console.error('Error fetching sellers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (sellerId, index) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this seller?');
    if (!confirmDelete) return;

    try {
      const row = rowRefs.current[index];
      if (row) await gsap.to(row, { opacity: 0, y: -20, duration: 0.3 });

      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:9000/api/admin/deladmin-seller/${sellerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSellers((prev) => prev.filter((s) => s._id !== sellerId));
    } catch (err) {
      console.error('Error deleting seller:', err);
    }
  };
  const BASE_URL = import.meta.env.VITE_BASE_API_URL

  const handleVerify = async (sellerId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${BASE_URL}/api/admin/verify-seller/${sellerId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSellers((prev) =>
        prev.map((s) =>
          s._id === sellerId ? { ...s, status: 'approved' } : s
        )
      );
    } catch (err) {
      console.error('Error verifying seller:', err);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  useEffect(() => {
    if (!loading && sellers.length > 0) {
      rowRefs.current.forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.5, delay: i * 0.05 }
        );
      });
    }
  }, [loading, sellers]);

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-green-700 mb-6 flex items-center gap-2">
        <Store className="w-7 h-7" />
        Registered Sellers
      </h1>

      {loading ? (
        <p className="text-gray-600">Loading sellers...</p>
      ) : sellers.length === 0 ? (
        <p className="text-gray-600">No sellers found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow-md">
            <thead className="bg-green-100 text-green-700 text-left">
              <tr>
                <th className="py-3 px-5">Name</th>
                <th className="py-3 px-5">Email</th>
                <th className="py-3 px-5">Company</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sellers.map((seller, index) => (
                <tr
                  key={seller._id}
                  ref={(el) => (rowRefs.current[index] = el)}
                  className="border-t hover:bg-green-50 transition duration-150"
                >
                  <td className="py-3 px-5">{seller.username}</td>
                  <td className="py-3 px-5">{seller.email}</td>
                  <td className="py-3 px-5">{seller.company || '-'}</td>
                  <td className="py-3 px-5 capitalize text-sm">
                    <span
                      className={`px-2 py-1 rounded-full ${seller.status === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                        }`}
                    >
                      {seller.status}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-center flex justify-center gap-2">
                    {seller.status === 'pending' && (
                      <button
                        onClick={() => handleVerify(seller._id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Verify
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(seller._id, index)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
