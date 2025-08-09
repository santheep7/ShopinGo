const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../model/user')
const Product = require('../model/productmodel')
const DEFAULT_ADMIN = {
  username: 'admin',
  password: 'admin@123', // 🔒 Default password
};

const generateToken = (admin) => {
  return jwt.sign(
    {
      username: admin.username,
      role: 'admin'
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: '5hr' }
  );
};

const adminLogin = async (req, res) => {
  const { username, password } = req.body;
  console.log("Received Admin Login:", { username, password });

  try {
    if (
      username === DEFAULT_ADMIN.username &&
      password === DEFAULT_ADMIN.password
    ) {
      const token = generateToken(DEFAULT_ADMIN);
      

      return res.json({
        message: 'Admin login successful',
        token,
        username: DEFAULT_ADMIN.username,
        role: 'admin'
        
      });
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    console.error('Admin Login Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const SeeUser = async(req,res)=>{
  try{
    const users = await User.find({role:'user'}).select('-password');
    res.status(200).json(users);
  }catch(err){
    console.log('error in fetching users',err)
    res.status(500).json({message:'server error in fetching user'});
  }
} 
const DelUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("User delete failed:", err);
    res.status(500).json({ message: "Server error while deleting user" });
  }
};

// Seller

const SeeSeller = async(req,res)=>{
  try{
    const users = await User.find({role:'seller'}).select('-password');
    res.status(200).json(users);
  }catch(err){
    console.log('error in fetching Seller',err)
    res.status(500).json({message:'server error in fetching Seller'});
  }
} 
const DelSeller = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedSeller = await User.findByIdAndDelete(id);

    if (!deletedSeller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    res.status(200).json({ message: "Seller deleted successfully" });
  } catch (err) {
    console.error("Seller delete failed:", err);
    res.status(500).json({ message: "Server error while deleting Seller" });
  }
};
const VerifySeller = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedSeller = await User.findByIdAndUpdate(
      id,
      { status: 'approved' },
      { new: true }
    );

    if (!updatedSeller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    res.status(200).json({ message: 'Seller verified successfully', seller: updatedSeller });
  } catch (err) {
    console.error("Seller verification failed:", err);
    res.status(500).json({ message: 'Server error while verifying seller' });
  }
};


const getAdminSummary = async(req,res)=>{
  try{
    const totalUsers = await User.countDocuments({role:"user"});
    const totalSeller = await User.countDocuments({role:'seller'});
    const totalProduct = await Product.countDocuments();
    const pendingApprovals = await User.countDocuments({role:'seller',status:'pending'});
    res.status(200).json({
      user:totalUsers,
      seller:totalSeller,
      Product:totalProduct,
      pendingApprovals:pendingApprovals,
    })

  }catch(err){
    console.log('error in fetching admin Summary',err);
    res.status(500).json({message:'Failed to load dashboard data'});
  }
}
module.exports = {
  adminLogin,
  SeeUser,
  DelUser,
  getAdminSummary,
  SeeSeller,
  DelSeller,
  VerifySeller
};
