import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios'
import {
    Users,
    Store,
    PackageCheck,
    Clock10,
    LogOut,
} from 'lucide-react';
import { useState } from 'react';
import { useEffect } from 'react';

export default function AdminHome() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/AdminLogin');
    };
     const [summary, setSummary] = useState({
    user: 0,
    seller: 0,
    Product: 0,
    pendingApprovals: 0,
  });
    const BASE_URL = import.meta.env.VITE_BASE_API_URL

   useEffect(() => {
    const fetchSummary = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get(`${BASE_URL}/api/admin/getadmin-summary`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSummary(res.data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
    };

    fetchSummary();
  }, []);

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-white shadow-md p-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-indigo-600">ShopinGo Admin Dashboard</h1>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </header>

            {/* Main Content */}
            <main className="p-6 space-y-8">
                {/* Welcome Box */}
                <div className="bg-white p-6 rounded-xl shadow">
                    <h2 className="text-xl font-semibold text-gray-800">Welcome back, Admin!</h2>
                    <p className="text-gray-500 mt-2">
                        Use the dashboard below to manage users, sellers, products, and more.
                    </p>
                </div>

                {/* Dashboard Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Link to="/AdminViewUser" className="block group no-underline">
                        <div className="bg-white p-6 rounded-xl shadow border-l-4 border-indigo-500 
                  transition-transform transform hover:-translate-y-1 hover:shadow-xl">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-700 group-hover:no-underline">Total Users</h3>
                                <Users className="text-indigo-500" />
                            </div>
                            <p className="mt-2 text-2xl font-bold text-indigo-600 group-hover:no-underline">{summary.user}</p>
                        </div>
                    </Link>


                    <Link to="/AdminSeller" className="block no-underline">
                        <div className="bg-white p-6 rounded-xl shadow border-l-4 border-green-500 
                            transition-transform transform hover:-translate-y-1 hover:shadow-xl">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-700">Sellers</h3>
                                <Store className="text-green-500" />
                            </div>
                            <p className="mt-2 text-2xl font-bold text-green-600">{summary.seller}</p>
                        </div>
                    </Link>

                    <Link to="/products" className="block no-underline">
                        <div className="bg-white p-6 rounded-xl shadow border-l-4 border-yellow-500 
                            transition-transform transform hover:-translate-y-1 hover:shadow-xl">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-700">Products</h3>
                                <PackageCheck className="text-yellow-500" />
                            </div>
                            <p className="mt-2 text-2xl font-bold text-yellow-600">{summary.Product}</p>
                        </div>
                    </Link>

                    <Link to="/admin/approvals" className="block no-underline">
                        <div className="bg-white p-6 rounded-xl shadow border-l-4 border-red-500 
                            transition-transform transform hover:-translate-y-1 hover:shadow-xl">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-700">Pending Approvals</h3>
                                <Clock10 className="text-red-500" />
                            </div>
                            <p className="mt-2 text-2xl font-bold text-red-600">{summary.pendingApprovals}</p>
                        </div>
                    </Link>
                </div>
            </main>
        </div>
    );
}
