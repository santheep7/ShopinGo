const express = require('express');
const router = express.Router();
const userControl = require('../controller/usercontrol');

router.post('/send-otp', userControl.sendOTP);
router.post('/verify-otp', userControl.verifyOTP);
router.post('/login-password', userControl.loginWithPassword);

module.exports = router;