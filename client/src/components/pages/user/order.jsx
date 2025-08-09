import React, { useEffect, useState } from "react";
import axios from "axios";

export default function OrderPage() {
  const [orders, setOrders] = useState([]);
  const BASE_URL = import.meta.env.VITE_BASE_API_URL

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${BASE_URL}/api/order/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(res.data);
      } catch (err) {
        console.error("Order fetch error:", err);
      }
    };

    fetchOrders();
  }, []);

  const handleCancel = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${BASE_URL}/api/order/cancel/${orderId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update UI locally
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: "cancelled" } : order
        )
      );
    } catch (err) {
      console.error("Error cancelling order:", err);
      alert("Could not cancel the order.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-600 text-center">No orders found.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm text-gray-500">
                    Order Date: {new Date(order.createdAt).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">Order ID: {order._id}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      order.status === "processing"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "shipped"
                        ? "bg-blue-100 text-blue-800"
                        : order.status === "delivered"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>

                  {["processing", "shipped"].includes(order.status) && (
                    <button
                      onClick={() => handleCancel(order._id)}
                      className="px-3 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {order.products.map((item, index) => {
                  const product = item.productId;
                  return (
                    <div
                      key={index}
                      className="flex gap-4 p-4 border border-gray-100 rounded-lg shadow-sm"
                    >
                      <img
                        src={`${BASE_URL}/uploads/${product.image}`}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h2 className="font-semibold">{product?.name}</h2>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 text-sm text-gray-700">
                <p><strong>Total Amount:</strong> ₹{order.totalAmount}</p>
                <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                <p><strong>Shipping Address:</strong> {order.shippingAddress}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
