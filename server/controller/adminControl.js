const jwt = require('jsonwebtoken');
require('dotenv').config();

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
    { expiresIn: '1hr' }
  );
};

const adminLogin = async (req, res) => {
  const { username, password } = req.body;

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

module.exports = {
  adminLogin
};
