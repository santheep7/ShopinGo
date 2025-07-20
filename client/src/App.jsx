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
const AdminHome = lazy(() => import('./components/pages/admin/AdminHome'))
const AdminUserList = lazy(() => import('./components/pages/admin/AdminViewUser'))
const AdminViewSellers = lazy(() => import('./components/pages/admin/AdminSeller'))
const SellerProfile = lazy(() => import('./components/pages/Seller/Profile'))
const CheckoutPage = lazy(() => import('./components/pages/user/checkout'))
const OrderPage = lazy(() => import('./components/pages/user/order'))
const ReviewForm = lazy(()=> import('./components/pages/user/reviewForm'))
const ProductDetails = lazy(()=> import('./components/pages/user/ProductDetails'))
// const SearchResultsPage = lazy(()=>import('./components/pages/user/search'))
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
          <Route path="/Profile" element={<SellerProfile />} />


          {/* User pages */}
          <Route path="/Login" element={<Login />} />
          <Route path="/reg" element={<RegisterPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="/product/:id/review" element={<ReviewForm />} />
          <Route path="/ProductDetails/:id" element={<ProductDetails />} />

          {/* <Route path ='/search' element={<SearchResultsPage/>}/> */}



          {/* Admin Pages */}
          <Route path="/AdminLogin" element={<AdminLogin />} />
          <Route path="/AdminHome" element={<AdminHome />} />
          <Route path="/AdminViewUser" element={<AdminUserList />} />
          <Route path="/AdminSeller" element={<AdminViewSellers />} />





        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
