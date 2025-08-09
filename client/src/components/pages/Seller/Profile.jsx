import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import confetti from 'canvas-confetti';
import { Building2, Mail, Phone, ShieldCheck } from 'lucide-react';
import UserNavbar from '../user/navbar';
import SellerNavbar from '../../common/sellernavbar';

export default function SellerProfile() {
  const [seller, setSeller] = useState(null);
  const hasCelebrated = useRef(false); // prevents confetti on every render
  const BASE_URL = import.meta.env.VITE_BASE_API_URL

  const fetchSellerProfile = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`${BASE_URL}/api/seller/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSeller(res.data);
    } catch (err) {
      console.error('Failed to fetch seller profile:', err);
    }
  };

  useEffect(() => {
    fetchSellerProfile();
  }, []);

  useEffect(() => {
    if (seller?.status === 'approved' && !hasCelebrated.current) {
      hasCelebrated.current = true;
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 },
      });
    }
  }, [seller]);

  if (!seller) {
    return <div className="p-6 text-gray-500">Loading profile...</div>;
  }

  return (
    <>
    <SellerNavbar/>
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-4xl font-bold">
            {seller.username?.charAt(0)?.toUpperCase()}
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mt-4">{seller.username}</h2>
          <p className="text-sm text-gray-500 capitalize">{seller.role}</p>
          <p className={`mt-2 text-xs font-medium inline-block px-3 py-1 rounded-full ${
            seller.status === 'approved'
              ? 'bg-green-100 text-green-700'
              : 'bg-yellow-100 text-yellow-700'
          }`}>
            {seller.status}
          </p>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-3 text-gray-700">
            <Mail className="w-5 h-5 text-indigo-500" />
            <span>{seller.email}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <Phone className="w-5 h-5 text-indigo-500" />
            <span>{seller.phone || 'Not provided'}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <Building2 className="w-5 h-5 text-indigo-500" />
            <span>{seller.company || 'No company info'}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <ShieldCheck className="w-5 h-5 text-indigo-500" />
            <span className="capitalize">Status: {seller.status}</span>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
