import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminHome() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/AdminLogin');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-600">ShopinGo Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
        >
          Logout
        </button>
      </header>

      {/* Content */}
      <main className="p-6 space-y-8">
        {/* Welcome */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold text-gray-800">Welcome back, Admin!</h2>
          <p className="text-gray-500 mt-2">
            Use the dashboard below to manage users, sellers, products, and more.
          </p>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow border-l-4 border-indigo-500">
            <h3 className="text-lg font-semibold text-gray-700">Total Users</h3>
            <p className="mt-2 text-2xl font-bold text-indigo-600">1023</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow border-l-4 border-green-500">
            <h3 className="text-lg font-semibold text-gray-700">Sellers</h3>
            <p className="mt-2 text-2xl font-bold text-green-600">57</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow border-l-4 border-yellow-500">
            <h3 className="text-lg font-semibold text-gray-700">Products</h3>
            <p className="mt-2 text-2xl font-bold text-yellow-600">456</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow border-l-4 border-red-500">
            <h3 className="text-lg font-semibold text-gray-700">Pending Approvals</h3>
            <p className="mt-2 text-2xl font-bold text-red-600">9</p>
          </div>
        </div>
      </main>
    </div>
  );
}
