"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";

export default function Profile() {
  const { data: session } = useSession();
  const [orderHistory, setOrderHistory] = useState([
    { id: 1, name: "Adidas Shoe", price: "$51" },
    { id: 2, name: "Nike Shirt", price: "$30" },
  ]);

  const addProduct = () => {
    const newProduct = { id: Date.now(), name: "New Product", price: "$99" };
    setOrderHistory([...orderHistory, newProduct]);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <p className="text-gray-700">Username: {session?.user?.name}</p>

      <h3 className="mt-4 text-lg font-semibold">Order History</h3>
      <ul className="mt-2">
        {orderHistory.map((order) => (
          <li key={order.id} className="flex justify-between p-2 border-b">
            {order.name} - {order.price} <button className="text-blue-500">[+]</button>
          </li>
        ))}
      </ul>

      <button onClick={addProduct} className="mt-4 bg-blue-500 text-white p-2 rounded">
        Add Product
      </button>
    </div>
  );
}
