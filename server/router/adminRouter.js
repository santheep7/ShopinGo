const express = require('express');
const { adminLogin } = require('../controller/adminControl');

const adminRoute = express.Router();


adminRoute.post('/admin-login',adminLogin)

module.exports = adminRoute;