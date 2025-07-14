import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// Lazy-loaded components
const Login = lazy(() => import('./components/pages/Login'));
const UserHome = lazy(() => import('./components/pages/user/homepage'));
const RegisterPage = lazy(() => import('./components/pages/user/reg'));
const SellerHome = lazy(() => import('./components/pages/Seller/Shome'));
const AddProduct = lazy(() => import('./components/pages/Seller/addproduct'));
const ViewProducts = lazy(() => import('./components/pages/Seller/myproducts'));
const EditProduct = lazy(() => import('./components/pages/Seller/updateproduct')); // ✅ This is used below
const CartPage = lazy(() => import('./components/pages/user/cart'))
const AdminLogin = lazy(() => import('./components/pages/admin/AdminLogin'))
const AdminHome = lazy(()=>import('./components/pages/admin/AdminHome'))
function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Homepage */}
          <Route path="/" element={<UserHome />} />

          {/* Seller pages */}
          <Route path="/Shome" element={<SellerHome />} />
          <Route path="/addproduct" element={<AddProduct />} />
          <Route path="/myproducts" element={<ViewProducts />} />
          <Route path="/updateproduct/:id" element={<EditProduct />} />
          {/* User pages */}
          <Route path="/Login" element={<Login />} />
          <Route path="/reg" element={<RegisterPage />} />
          <Route path="/cart" element={<CartPage />} />
          {/* Admin Pages */}
          <Route path="/AdminLogin" element={<AdminLogin />} />
          <Route path="/AdminHome" element={<AdminHome />} />




        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
