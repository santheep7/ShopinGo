import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
export default function AdminLogin() {
  const [showPassword,setShowPassword] = useState(false)
  const [adminData, setAdminData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_API_URL

  const handleChange = (e) => {
    setAdminData({ ...adminData, [e.target.name]: e.target.value });
  };
  const togglePassword = () => setShowPassword((prev) => !prev);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const res = await axios.post(`${BASE_URL}/api/admin/admin-login`, adminData);

      if (res.data.token && res.data.role === 'admin') {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('role', res.data.role);
        navigate('/AdminHome');
      } else {
        setError('Invalid admin login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-indigo-100">
      <div className="w-full max-w-md p-8 bg-white shadow-2xl rounded-2xl">
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6">ShopinGo Admin Login</h1>

        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">Username</label>
            <input
              type="text"
              name="username"
              value={adminData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>

         <div>
      <label className="block mb-1 text-sm font-medium text-gray-600">Password</label>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          name="password"
          value={adminData.password}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none pr-10"
        />
        <button
          type="button"
          onClick={togglePassword}
          className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>


          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition duration-300"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">© 2025 ShopinGo Admin Panel</p>
      </div>
    </div>
  );
}
