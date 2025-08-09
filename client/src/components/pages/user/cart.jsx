// CartPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UserNavbar from "./navbar";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_API_URL;

  const fetchCart = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/cart/get`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setCart(res.data.items);
    } catch (err) {
      console.error("Cart fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (productId) => {
    try {
      await axios.delete(`${BASE_URL}/api/cart/remove/${productId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      fetchCart();
    } catch (err) {
      console.error("Remove error:", err);
    }
  };

  const placeCODOrder = async () => {
    if (!window.confirm("Place order with Cash on Delivery?")) return;
    try {
      setPlacingOrder(true);

      const token = localStorage.getItem("token");

      // Map cart to match backend's expected { productId, quantity }
      const products = cart.map(item => ({
        productId: item.productId._id,
        quantity: item.quantity
      }));

      // For now, hardcode or get this from user profile/checkout form
      const shippingAddress = "123 Main Street, Your City";

      await axios.post(`${BASE_URL}/api/order/create`, {
        paymentMethod: "COD",
        amount: totalAmount,
        products,
        shippingAddress
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Order placed successfully with COD!");
      navigate("/order");
    } catch (err) {
      console.error("COD order error:", err);
      alert("Failed to place COD order.");
    } finally {
      setPlacingOrder(false);
    }
  };


  useEffect(() => {
    fetchCart();
  }, []);

  const totalAmount = cart.reduce((sum, item) => {
    const product = item.productId;
    return sum + (product?.productPrice || 0) * item.quantity;
  }, 0);

  return (
    <>
      <UserNavbar />
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">🛒 Your Cart</h1>
        {loading ? (
          <p>Loading...</p>
        ) : cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <div className="space-y-4">
              {cart.map((item) => {
                const product = item.productId;
                return (
                  <div
                    key={product._id}
                    className="flex justify-between items-center bg-white shadow-md rounded-lg p-4"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={product.image}
                        alt={product.productName}
                        className="w-16 h-16 object-cover rounded"
                      />

                      <div>
                        <h2 className="font-semibold">{product.productName}</h2>
                        <p>₹{product.productPrice} × {item.quantity}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(product._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ❌ Remove
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 text-xl font-bold text-right">
              Total: ₹{totalAmount}
            </div>
          </>
        )}

        {cart.length > 0 && (
          <div className="mt-6 flex justify-end space-x-4">
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </button>

            <button
              disabled={placingOrder}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
              onClick={placeCODOrder}
            >
              {placingOrder ? "Placing COD Order..." : "Cash on Delivery"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
