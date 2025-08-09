import React from 'react';
import {
  DollarSignIcon,
  PackageIcon,
  ClipboardListIcon,
  ClockIcon,
  PlusCircleIcon,
  EyeIcon,
  ListOrderedIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SellerNavbar from '../../common/sellernavbar';

export default function SellerHome() {
  const navigate = useNavigate();

  return (
    <>
    <SellerNavbar/>
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Welcome, Seller 👋</h1>
        <p className="text-gray-500">Here’s your seller dashboard</p>
      </header>

      {/* Dashboard Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-xl shadow-sm p-5 flex items-center justify-between">
          <div>
            <h2 className="text-sm text-gray-500">Total Earnings</h2>
            <p className="text-2xl font-bold text-green-600">₹32,500</p>
          </div>
          <DollarSignIcon className="w-10 h-10 text-green-500" />
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 flex items-center justify-between">
          <div>
            <h2 className="text-sm text-gray-500">Products Listed</h2>
            <p className="text-2xl font-bold text-blue-600">18</p>
          </div>
          <PackageIcon className="w-10 h-10 text-blue-500" />
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 flex items-center justify-between">
          <div>
            <h2 className="text-sm text-gray-500">Total Orders</h2>
            <p className="text-2xl font-bold text-purple-600">94</p>
          </div>
          <ClipboardListIcon className="w-10 h-10 text-purple-500" />
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 flex items-center justify-between">
          <div>
            <h2 className="text-sm text-gray-500">Pending Orders</h2>
            <p className="text-2xl font-bold text-red-600">6</p>
          </div>
          <ClockIcon className="w-10 h-10 text-red-500" />
        </div>
      </section>

      {/* Quick Actions */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div
          onClick={() => navigate('/addproduct')}
          className="bg-white hover:bg-blue-50 cursor-pointer border border-blue-200 rounded-xl p-6 shadow-sm flex flex-col items-center transition"
        >
          <PlusCircleIcon className="w-10 h-10 text-blue-600 mb-2" />
          <h3 className="text-lg font-semibold text-gray-700">Add Product</h3>
          <p className="text-sm text-gray-500 text-center">Create and publish a new product</p>
        </div>

        <div
          onClick={() => navigate('/myproducts')}
          className="bg-white hover:bg-indigo-50 cursor-pointer border border-indigo-200 rounded-xl p-6 shadow-sm flex flex-col items-center transition"
        >
          <EyeIcon className="w-10 h-10 text-indigo-600 mb-2" />
          <h3 className="text-lg font-semibold text-gray-700">View Products</h3>
          <p className="text-sm text-gray-500 text-center">Manage your product listings</p>
        </div>

        <div
          onClick={() => navigate('/seller/orders')}
          className="bg-white hover:bg-green-50 cursor-pointer border border-green-200 rounded-xl p-6 shadow-sm flex flex-col items-center transition"
        >
          <ListOrderedIcon className="w-10 h-10 text-green-600 mb-2" />
          <h3 className="text-lg font-semibold text-gray-700">View Orders</h3>
          <p className="text-sm text-gray-500 text-center">Track and fulfill orders</p>
        </div>
      </section>

      {/* Sales Graph Placeholder */}
      <section className="mt-10 bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Sales Overview</h2>
        <div className="h-64 flex items-center justify-center text-gray-400 border-2 border-dashed rounded-lg">
          📊 Sales graph placeholder (connect Chart.js or Recharts)
        </div>
      </section>
    </div>
    </>
  );
}
