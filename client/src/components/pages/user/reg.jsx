import React, { useState } from "react";
import AXIOS from 'axios';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UseNavbar from "./navbar";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [record, setRecord] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    otp: "",
    role: "", // user or seller
    company: "" // only for seller
  });
  const [passwordStrength, setPasswordStrength] = useState("");

  const [error, setError] = useState({});
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_API_URL

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecord({ ...record, [name]: value });

    if (name === "password") {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };


  const validate = () => {
    const newError = {};
    if (!record.username.trim()) newError.username = "Username is required";
    if (!record.email.trim()) newError.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(record.email)) newError.email = "Invalid email format";
    if (!record.password) newError.password = "Password is required";
    else if (record.password.length < 6) newError.password = "Password must be at least 6 characters";
    if (!record.role) newError.role = "Please select a role";
    if (record.role === "seller" && !record.company.trim()) newError.company = "Company name is required";
    return newError;
  };
  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[\W]/.test(password)) strength += 1;

    if (strength <= 2) return "Weak";
    else if (strength === 3 || strength === 4) return "Medium";
    else return "Strong";
  };
  const getStrengthColor = () => {
    if (passwordStrength === "Weak") return "bg-red-500 w-1/3";
    if (passwordStrength === "Medium") return "bg-yellow-500 w-2/3";
    if (passwordStrength === "Strong") return "bg-green-500 w-full";
    return "bg-gray-300 w-0";
  };



  const sendOTP = async () => {
    const validateErrors = validate();
    if (Object.keys(validateErrors).length > 0) {
      setError(validateErrors);
      return;
    }
    if (checkPasswordStrength(record.password) === "Weak") {
      toast.error("Password is too weak. Please use a stronger password.");
      return;
    }

    try {
      await AXIOS.post(`${BASE_URL}/api/user/send-otp`, {
        email: record.email,
        role: record.role,
        phone: record.phone,
        company: record.role === "seller" ? record.company : undefined,
        mode: "register", // 👈 ADD THIS
      });

      toast.success("OTP sent to email");
      setOtpSent(true);
    } catch (err) {
      console.log(err);
      toast.error("Failed to send OTP");
    }
  };

  const verifyAndRegister = async (e) => {
    e.preventDefault();
    if (!record.otp.trim()) {
      toast.error("Please enter OTP");
      return;
    }

    try {
      const res = await AXIOS.post(`${BASE_URL}/api/user/verify-otp`, record);
      toast.success("Registered successfully");
      setTimeout(() => navigate("/Login"), 2000);
    } catch (err) {
      console.log(err);
      toast.error("OTP verification failed");
    }
  };

  return (
    <>
      <UseNavbar />
      <ToastContainer position="top-center" autoClose={3000} transition={Bounce} theme="light" />

      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-white px-4">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Create your ShopinGO Account</h2>

          <form onSubmit={verifyAndRegister} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                name="username"
                value={record.username}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-1 border rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-300"
                placeholder="Enter your name"
                disabled={otpSent}
              />
              {error.username && <p className="text-sm text-red-500">{error.username}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={record.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-1 border rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-300"
                placeholder="Enter your phone number"
                disabled={otpSent}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={record.email}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-1 border rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-300"
                placeholder="Enter email"
                disabled={otpSent}
              />
              {error.email && <p className="text-sm text-red-500">{error.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block">Password:</label>
              <input
                type="password"
                name="password"
                className="w-full border rounded px-3 py-2"
                value={record.password}
                onChange={handleChange}
              />
              {/* Password strength bar */}
              {record.password && (
                <div className="h-2 w-full rounded mt-1">
                  <div className={`h-2 ${getStrengthColor()} rounded transition-all`} />
                  <p className="text-xs text-gray-600 mt-1">Strength: {passwordStrength}</p>
                </div>
              )}
              {/* Password requirements hint */}
              {record.password && (
                <ul className="text-xs text-gray-500 mt-4 list-disc pl-4">
                  <li>At least 8 characters</li>
                  <li>1 uppercase letter</li>
                  <li>1 number</li>
                  <li>1 special character (e.g. @, #, $, %)</li>
                </ul>
              )}
              {error.password && <p className="text-red-500 text-sm">{error.password}</p>}
            </div>


            {/* Role Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Register As</label>
              <select
                name="role"
                value={record.role}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-1 border rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-300"
                disabled={otpSent}
              >
                <option value="">Select Role</option>
                <option value="user">User</option>
                <option value="seller">Seller</option>
              </select>
              {error.role && <p className="text-sm text-red-500">{error.role}</p>}
            </div>

            {/* Company name if seller */}
            {record.role === 'seller' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Company Name</label>
                <input
                  type="text"
                  name="company"
                  value={record.company}
                  onChange={handleChange}
                  className="w-full px-4 py-2 mt-1 border rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-300"
                  placeholder="Enter your company name"
                  disabled={otpSent}
                />
                {error.company && <p className="text-sm text-red-500">{error.company}</p>}
              </div>
            )}

            {/* Send OTP / Register Flow */}
            {!otpSent ? (
              <button
                type="button"
                onClick={sendOTP}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition"
              >
                Send OTP
              </button>
            ) : (
              <>
                {/* OTP Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">OTP</label>
                  <input
                    type="text"
                    name="otp"
                    value={record.otp}
                    onChange={handleChange}
                    className="w-full px-4 py-2 mt-1 border rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-300"
                    placeholder="Enter OTP"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition"
                >
                  Verify & Register
                </button>
              </>
            )}

            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <a href="/Login" className="text-blue-600 hover:underline">
                Login here
              </a>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
