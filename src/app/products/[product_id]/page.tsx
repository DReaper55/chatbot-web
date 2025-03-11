// import { useRouter } from "next/router";
// import { useState, useEffect } from "react";
// import axios from "axios";

// export default function ProductPage() {
//   const router = useRouter();
//   const { id } = router.query;
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (id) {
//       axios.get(`https://your-chatbot-api.com/products/${id}`)
//         .then((res) => {
//           setProduct(res.data);
//           setLoading(false);
//         })
//         .catch((err) => {
//           console.error("Failed to fetch product", err);
//           setLoading(false);
//         });
//     }
//   }, [id]);

//   const addToOrderHistory = () => {
//     const existingOrders = JSON.parse(localStorage.getItem("orderHistory")) || [];
//     localStorage.setItem("orderHistory", JSON.stringify([...existingOrders, product]));
//     alert(`${product.name} added to order history!`);
//   };

//   if (loading) return <p className="text-center">Loading product details...</p>;

//   if (!product) return <p className="text-center">Product not found.</p>;

//   return (
//     <div className="max-w-2xl mx-auto p-6">
//       <img src={product.image} alt={product.name} className="w-full h-64 object-cover rounded-lg shadow-md" />
//       <h2 className="text-2xl font-bold mt-4">{product.name}</h2>
//       <p className="text-gray-600 text-lg">{product.price}</p>
//       <p className="mt-2 text-gray-700">{product.description}</p>
//       <button onClick={addToOrderHistory} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
//         Add to Order History
//       </button>
//     </div>
//   );
// }
