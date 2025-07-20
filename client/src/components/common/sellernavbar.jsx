import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MenuIcon, XIcon, LogOutIcon, UserIcon } from 'lucide-react';

export default function SellerNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedName = localStorage.getItem('username');
    if (storedName) setUsername(storedName);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role')
    navigate('/');
  };

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/Shome" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-all duration-300 no-underline">
          🛍️ ShopinGO Seller
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <AnimatedLink to="/Shome" label="Dashboard" />
          <AnimatedLink to="/addproduct" label="Add Product" />
          <AnimatedLink to="/myproducts" label="My Products" />
          <AnimatedLink to="/orders" label="Orders" />
          <AnimatedLink to="/Profile" label="Profile" />

          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition"
            >
              <UserIcon className="w-5 h-5" />
              {username || 'Seller'}
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-44 bg-white border rounded-md shadow-md py-2 z-50">
                <div className="px-4 py-2 text-sm text-gray-700">
                  Signed in as <strong>{username}</strong>
                </div>
                <hr />
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                >
                  <LogOutIcon className="inline w-4 h-4 mr-1" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Button */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          <AnimatedLink to="/Shome" label="Dashboard" mobile />
          <AnimatedLink to="/addproduct" label="Add Product" mobile />
          <AnimatedLink to="/myproducts" label="My Products" mobile />
          <AnimatedLink to="/orders" label="Orders" mobile />
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-1 text-red-600 hover:text-red-800 py-2 text-sm"
          >
            <LogOutIcon className="w-4 h-4" />
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

function AnimatedLink({ to, label, mobile = false }) {
  return (
    <Link
      to={to}
      className={`relative group text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 no-underline ${mobile ? 'block py-2 text-sm' : ''}`}
    >
      <span className="relative">
        {label}
        <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
      </span>
    </Link>
  );
}
