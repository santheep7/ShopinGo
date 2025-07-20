const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String },                      // Can be set during OTP verification
  email:    { type: String, required: true, unique: true },
  password: { type: String },                      // Optional for OTP users
  phone:    { type: String },
  company:  { type: String },                      // Optional, mostly for sellers
  role:     { type: String, enum: ['user', 'seller'], default: 'user' },
  otp:      { type: String },
  status: {
  type: String,
  enum: ['pending', 'approved'],
  default: 'pending'
}                       // For OTP-based auth
}, { timestamps: true });

const User = mongoose.model("users", userSchema);

module.exports = User;
