import React from 'react';
import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        
        {/* Logo + About */}
        <div>
          <h2 className="text-2xl font-bold text-blue-400">ShopinGO</h2>
          <p className="text-sm mt-2 text-gray-400">
            Your trusted platform for shopping, selling, and seamless e-commerce experiences. We connect buyers and sellers with ease and security.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li><a href="/" className="hover:text-blue-400 transition [text-decoration]">Home</a></li>
            <li><a href="/addproduct" className="hover:text-blue-400 transition no-underline">Add Product</a></li>
            <li><a href="/myproducts" className="hover:text-blue-400 transition no-underline">My Products</a></li>
            <li><a href="/login" className="hover:text-blue-400 transition no-underline">Login</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-center gap-2">
              <PhoneIcon className="w-4 h-4 text-blue-400" />
              +91 98765 43210
            </li>
            <li className="flex items-center gap-2">
              <MailIcon className="w-4 h-4 text-blue-400" />
              support@shopingo.com
            </li>
            <li className="flex items-center gap-2">
              <MapPinIcon className="w-4 h-4 text-blue-400" />
              Kochi, Kerala - India
            </li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
          <div className="flex gap-4 text-gray-400">
            <a href="#" className="hover:text-blue-400 transition">
              <FacebookIcon />
            </a>
            <a href="#" className="hover:text-pink-400 transition">
              <InstagramIcon />
            </a>
            <a href="#" className="hover:text-sky-400 transition">
              <TwitterIcon />
            </a>
          </div>
        </div>
      </div>

      <div className="text-center text-gray-500 text-sm py-4 border-t border-gray-800">
        © {new Date().getFullYear()} ShopinGO. All rights reserved.
      </div>
    </footer>
  );
}
