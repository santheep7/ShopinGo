import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {ToastContainer,toast} from 'react-toastify'
export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [input, setInput] = useState('');
  const [usePassword, setUsePassword] = useState(false);
  const [role, setRole] = useState('user');
  const [step, setStep] = useState('start'); // start → otpSent

  const handleSendOTP = async () => {
  try {
    const res = await axios.post('http://localhost:9000/api/user/send-otp', { email, role });
    toast.success("OTP Sent to Registered email..!");
    setStep('otpSent');
  } catch (err) {
    const msg = err.response?.data?.message || "Error sending OTP";
    toast.error(msg);
  }
};

  const handleLogin = async () => {
    try {
      const endpoint = usePassword ? 'login-password' : 'verify-otp';
      const payload = usePassword
        ? { email, password: input }
        : { email, otp: input };

      const res = await axios.post(`http://localhost:9000/api/user/${endpoint}`, payload);
      console.log("Full response:", res.data);;
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('username',res.data.username);


      if (res.data.role === 'admin') navigate('/adminhome');
      else if (res.data.role === 'seller') navigate('/Shome');
      else navigate('/');
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <>
    <ToastContainer/>
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login to ShopinGO</h2>

        <label className="block mb-2 text-sm font-medium text-gray-700">Select Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full p-2 mb-4 border rounded-md bg-gray-50"
        >
          <option value="user">User</option>
          <option value="seller">Seller</option>
        </select>

        <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border rounded-md bg-gray-50"
          placeholder="Enter your email"
        />

        {step === 'start' && (
          <button
            onClick={handleSendOTP}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
          >
            Send OTP
          </button>
        )}

        {step === 'otpSent' && (
          <>
            <label className="block mt-4 mb-2 text-sm font-medium text-gray-700">
              {usePassword ? 'Password' : 'Enter OTP'}
            </label>
            <input
              type={usePassword ? 'password' : 'text'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full p-2 mb-4 border rounded-md bg-gray-50"
              placeholder={usePassword ? 'Enter password' : 'Enter OTP'}
            />

            <div className="flex justify-between items-center mb-4">
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={usePassword}
                  onChange={() => setUsePassword(!usePassword)}
                  className="mr-2"
                />
                Use password instead
              </label>
              <button
                onClick={handleSendOTP}
                className="text-xs text-blue-600 hover:underline"
              >
                Resend OTP
              </button>
            </div>

            <button
              onClick={handleLogin}
              className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition"
            >
              Login
            </button>
          </>
        )}
      </div>
    </div>
    </>
  );
}
