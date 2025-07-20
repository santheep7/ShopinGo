const express = require('express');
const { SeeUser, adminLogin, DelUser, getAdminSummary, SeeSeller, DelSeller, VerifySeller } = require('../controller/adminControl');
const adminRoute = express.Router();
const { protect } = require('../auth/jwtauthentiaction')

adminRoute.post('/admin-login', adminLogin)
adminRoute.get('/admin-user',protect(['admin']),SeeUser)
adminRoute.delete('/delete-user/:id',protect(['admin']),DelUser)
adminRoute.get('/getadmin-summary',protect(['admin']),getAdminSummary)
adminRoute.get('/getadmin-seller',protect(['admin']),SeeSeller)
adminRoute.delete('/deladmin-seller',protect(['admin']),DelSeller)
adminRoute.put('/verify-seller/:id', protect(['admin']), VerifySeller);



module.exports = adminRoute;