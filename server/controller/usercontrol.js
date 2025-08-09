const User = require('../model/user');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken')
require('dotenv').config()
const sendOTP = async (req, res) => {
  try {
    const { email, phone, role = 'user', company, mode = "login" } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Check if user exists with this email AND role
    let user = await User.findOne({ email, role });

    if (user) {
      // Existing user — just update OTP
      user.otp = otp;
      await user.save();
    } else {
      // New user trying to register
      if (role === 'seller' && mode !== "register") {
        return res.status(403).json({ message: "Seller not found. Please contact admin." });
      }

      // Allow new registration (user or seller if mode === "register")
      user = new User({ email, otp, role, phone,company });
      await user.save();
    }

    // Setup nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "santheepkrishna09@gmail.com",
        pass: "pmoy xmcj jxma cwlz", // Gmail App Password
      },
    });

    await transporter.sendMail({
      from: "ShopinGO <santheepkrishna09@gmail.com>",
      to: email,
      subject: "Your ShopinGO OTP",
      text: `Your OTP is ${otp}`,
    });

    console.log(`OTP ${otp} sent to ${email}`);
    res.status(200).json({ message: "OTP sent successfully" });

  } catch (err) {
    console.error("🔥 Error in sendOTP:", err);
    res.status(500).json({ message: "Error sending OTP" });
  }
};




const verifyOTP = async (req, res) => {
  try {
    const { email, otp, username, password } = req.body;
    // In your verifyOTP controller, add:
    
    const user = await User.findOne({ email });
    console.log("User document:", user);

    if (!user || user.otp !== otp) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    // Update user details if they're registering
    if (username) user.username = username;
    if (password) user.password = password;

    user.otp = null; // clear OTP
    await user.save();

    const token = jwt.sign(
      { 
        id: user._id, 
        role: user.role,
        username: user.username // Ensure username is included in token
      },
      process.env.JWT_SECRET_KEY, 
      { expiresIn: '10hr' }
    );

    res.json({ 
      token, 
      role: user.role,
      username: user.username, // Send username in response
      message: "OTP verified & user registered" 
    });

  } catch (err) {
    console.error("OTP Verification Error:", err);
    res.status(500).json({ message: "Server error during OTP verification" });
  }
};

const loginWithPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { 
        id: user._id, 
        role: user.role,
        username: user.username // Ensure username is included in token
      },
      process.env.JWT_SECRET_KEY, 
      { expiresIn: '1hr' }
    );

    res.json({ 
      token, 
      role: user.role, 
      username: user.username, // Send username in response
      message: "Login successful" 
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
};

module.exports={loginWithPassword,verifyOTP,sendOTP}