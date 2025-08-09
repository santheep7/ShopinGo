import React, { useState, useEffect } from "react";
import axios from "axios";
import UserNavbar from "./navbar";

export default function CheckoutPage() {
  const [cart, setCart] = useState([]);
  const [shippingAddress, setShippingAddress] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:9000/api/cart/get", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setCart(res.data.items))
      .catch((err) => console.error("Cart fetch error:", err));
  }, []);

  const totalAmount = cart.reduce((sum, item) => {
    return sum + item.productId.productPrice * item.quantity;
  }, 0);

  const handlePayment = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Please login first.");
    return;
  }

  try {
    const orderData = {
      amount: totalAmount
      // ❌ remove userId from here — your backend can get it from token
    };

    const orderRes = await axios.post(
      "http://localhost:9000/api/order/create",
      orderData,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const order = orderRes.data;

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: "INR",
      name: "ShopinGo",
      description: "Order Payment",
      order_id: order.id,
      handler: async function (response) {
        await axios.post(
          "http://localhost:9000/api/order/verify",
          {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            // ❌ don't send userId — your backend will extract it from token
            products: cart,
            totalAmount,
            shippingAddress,
            paymentMethod: "Online"
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        alert("Payment Successful!");
        window.location.href = "/cart";
      },
      prefill: {
        contact: phone
      },
      theme: {
        color: "#3399cc"
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (err) {
    console.error("Razorpay error:", err);
  }
};



  return (
    <>
    <UserNavbar/>
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      <textarea
        className="w-full border p-2 mb-4"
        placeholder="Shipping Address"
        value={shippingAddress}
        onChange={(e) => setShippingAddress(e.target.value)}
      />
      <input
        type="tel"
        className="w-full border p-2 mb-4"
        placeholder="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <h2 className="text-lg font-semibold">Total: ₹{totalAmount}</h2>
      <button
        className="bg-green-600 text-white px-6 py-2 rounded mt-4 hover:bg-green-700"
        onClick={handlePayment}
      >
        Pay Now
      </button>
    </div>
    </>
  );
}
