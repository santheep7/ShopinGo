import React, { useEffect, useState } from "react";
import axios from "axios";

export default function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
 const BASE_URL = import.meta.env.VITE_BASE_API_URL

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BASE_URL}/api/seller/getorder`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, productId, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${BASE_URL}/api/seller/updatestatus`,
        { orderId, productId, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders(); // Refresh after update
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  if (loading) return <p>Loading orders...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Seller Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            style={{
              border: "1px solid #ddd",
              marginBottom: "15px",
              padding: "15px",
              borderRadius: "8px",
            }}
          >
            <p>
              <strong>Customer:</strong> {order.user?.name} ({order.user?.email})
            </p>
            <p>
              <strong>Order Date:</strong>{" "}
              {new Date(order.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Payment:</strong> {order.paymentMethod}
            </p>

            {order.products.map((p) => (
              <div
                key={p.productId}
                style={{
                  display: "flex",
                  alignItems: "center",
                  margin: "10px 0",
                  borderTop: "1px solid #eee",
                  paddingTop: "10px",
                }}
              >
                <img
                  src={p.image}
                  alt={p.productName}
                  width="60"
                  height="60"
                  style={{ borderRadius: "6px", marginRight: "10px" }}
                />
                <div>
                  <p>{p.productName}</p>
                  <p>
                    ₹{p.price} × {p.quantity}
                  </p>
                  <p>Status: {p.status}</p>
                  <select
                    value={p.status}
                    onChange={(e) =>
                      updateStatus(order._id, p.productId, e.target.value)
                    }
                  >
                    <option value="processing">Processing</option>
                    <option value="shipping">Shipping</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}
