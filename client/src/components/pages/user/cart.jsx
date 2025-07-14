// components/pages/CartPage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem("token"); // ✅ token from localStorage

      const res = await axios.get("http://localhost:9000/api/cart/get-cart", {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ pass it to backend
        },
      });

      setCartItems(res.data);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    }
  };

  fetchCartItems();
}, []);

  const handleQuantityChange = (index, newQty) => {
    const updated = [...cartItems];
    updated[index].selectedQuantity = newQty;
    setCartItems(updated);
  };

  const handleRemoveItem = async (productId) => {
    await axios.delete(`/api/cart/${productId}`);
    setCartItems(cartItems.filter((item) => item._id !== productId));
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (acc, item) => acc + item.productPrice * item.selectedQuantity,
      0
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Your Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <>
         <div className="grid gap-4">
  {cartItems.map((item, index) => (
    <div key={item._id} className="flex items-center gap-4 p-3 border rounded-lg shadow-sm bg-white">
      {/* Product Image (smaller height) */}
      <img
        src={
          item.image?.startsWith("http")
            ? item.image
            : `http://localhost:9000/uploads/${item.image}`
        }
        alt={item.productName}
        className="h-24 w-24 object-cover rounded-md"
      />

      {/* Info Section */}
      <div className="flex flex-col flex-grow text-sm">
        <div className="flex justify-between">
          <h2 className="font-semibold text-gray-800 truncate">{item.productName}</h2>
          <span className="text-blue-600 font-bold ml-4">₹{item.productPrice}</span>
        </div>
        <p className="text-xs text-gray-500">{item.brand}</p>
        <p className="text-xs text-gray-500">Category: {item.category}</p>

        {/* Quantity and Actions */}
        <div className="flex items-center gap-3 mt-2">
          <label className="text-xs text-gray-600">Qty:</label>
          <input
            type="number"
            min={1}
            max={item.productQuantity}
            value={item.selectedQuantity}
            onChange={(e) =>
              handleQuantityChange(index, parseInt(e.target.value))
            }
            className="w-14 text-sm px-2 py-1 border rounded"
          />

          <button
            onClick={() => handleRemoveItem(item._id)}
            className="text-red-500 text-xs ml-auto hover:underline"
          >
            Remove
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-1">
          In Stock: {item.productQuantity}
        </p>
        <p className="text-xs font-medium mt-1 text-gray-700">
          Total: ₹{item.productPrice * item.selectedQuantity}
        </p>
      </div>
    </div>
  ))}
</div>


          <div className="mt-6 border-t pt-4 text-right">
            <p className="text-xl font-semibold">
              Grand Total: ₹{calculateTotal()}
            </p>
            <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
