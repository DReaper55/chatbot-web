import * as React from "react";
import { CommandInput, CommandList, CommandGroup, CommandItem, CommandShortcut, CommandSeparator, CommandEmpty, Command } from "@/app/components/general/command";
import { Trash2, PlusCircle, Package, ShoppingBag } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { Product } from "@/app/interfaces/product";
import { useRouter } from "next/navigation";


// Mock data for products and orders
const products: Product[] = [
  { product_id: "1", price: 2000, name: "Wireless Mouse" },
  { product_id: "2", price: 3000, name: "Mechanical Keyboard" },
  { product_id: "3", price: 4000, name: "Noise Cancelling Headphones" },
];

const orders = [
  { id: 101, name: "Order #101 - iPhone 15 Pro" },
  { id: 102, name: "Order #102 - MacBook Air M2" },
  { id: 103, name: "Order #103 - Smart Watch" },
];

export default function ProductOrderCommand() {
  const [productList, setProductList] = React.useState<Product[]>([]);
  const [orderList, setOrderList] = React.useState(orders);

  const router = useRouter();
  
  React.useEffect(()=>{
    getProducts()

    return;
  })

  const getProducts = async () => {
    if(productList.length > 0) return;

    try {
        const res = await fetch("/api/products");
  
        if (res.status === 401) {
          // If session expired, redirect to login
          alert("Your session has expired. Please log in again.");
          router.push("/login"); // Redirect to login page
          return;
        }

        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
  
        setProductList(data as Product[]);

        console.log(res)
      } catch (err) {
        console.error("Error:", err);
        // setError("Something went wrong");
      }
  }

  // Function to add a product to the orders list
  const addProduct = (product: any) => {
    setOrderList((prevOrders) => [...prevOrders, { ...product, id: uuidv4(), name: product }]);
    setProductList((prevProducts) => prevProducts.filter((p) => p.product_id !== product.id));
  };

  // Function to remove an order from the list
  const removeOrder = (orderId: number) => {
    setOrderList((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
  };

  return (
    <Command>
      <CommandInput placeholder="Search Products or Orders..." />

      <CommandList>
        {/* Orders Section */}
        <CommandGroup heading="Orders">
          {orderList.length > 0 ? (
            orderList.map((order) => (
              <CommandItem key={order.id} onSelect={() => removeOrder(order.id)} className="cursor-pointer">
                <ShoppingBag className="w-4 h-4 text-yellow-400" />
                {order.name}
                <CommandShortcut> <Trash2 className="h-4 w-4" /> </CommandShortcut>
              </CommandItem>
            ))
          ) : (
            <CommandEmpty>No orders found.</CommandEmpty>
          )}
        </CommandGroup>

        <CommandSeparator />

        {/* Products Section */}
        <CommandGroup heading="Products">
          {productList.map((product) => (
            <CommandItem key={product.product_id} onSelect={addProduct} className="text-green-500 cursor-pointer">
              <Package className="w-4 h-4 text-blue-400" />
              {product.name}
              <CommandShortcut><PlusCircle className="h-4 w-4" /></CommandShortcut>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
