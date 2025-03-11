import { useState, useEffect } from "react";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   axios.get("https://api.com/products")
  //     .then((res) => {
  //       setProducts(res.data);
  //       setLoading(false);
  //     })
  //     .catch((err) => console.error("Failed to fetch products", err));
  // }, []);

  // const addToOrderHistory = (product) => {
  //   const existingOrders = JSON.parse(localStorage.getItem("orderHistory")) || [];
  //   localStorage.setItem("orderHistory", JSON.stringify([...existingOrders, product]));
  //   alert(`${product.name} added to order history!`);
  // };

  if (loading) return <p className="text-center">Loading products...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Products 🛍️</h2>
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border p-4 rounded shadow-md">
            <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded" />
            <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
            <p className="text-gray-500">{product.price}</p>
            <button onClick={() => addToOrderHistory(product)} className="mt-2 bg-blue-500 text-white p-2 rounded">
              Add to Order History
            </button>
          </div>
        ))}
      </div> */}
    </div>
  );
}
