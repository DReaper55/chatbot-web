import { getSession } from "next-auth/react";

const API_URL = process.env.API_URL || "http://localhost:8000";

// .................................
// User Database
// .................................
export const usersDB = {
  async getUserByUsername(username: string) {
    const res = await fetch(`${API_URL}/users/${username}`);
    if (!res.ok) throw new Error("User not found");
    return res.json();
  },

  async createUser(username: string, password: string) {
    const res = await fetch(`${API_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "User creation failed");
    }

    return res.json();
  },

  async validateUser(username: string, password: string) {
    try {  
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });
  
      if (!res.ok) {
        const errorText = await res.text(); // Log API response
        throw new Error(`Invalid credentials: ${errorText}`);
      }
  
      return res.json();
    } catch (error) {
      console.error("Fetch error:", error);
      throw new Error("Failed to connect to the authentication server.");
    }
  }  
};


// .................................
// Product Database
// .................................
export const productDB = {
  async getProductById(product_id: string, token?: string | null) {
    const res = await fetch(`${API_URL}/products/${product_id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Get one product");
    return res.json();
  },

  async getProducts(token?: string | null) {
    const res = await fetch(`${API_URL}/products`, {
      method: "GET",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Get all products");
    }

    return res.json();
  },
};


// .................................
// Order Database
// .................................
export const orderDB = {
  async createOrder(order: {}, token?: string | null) {
    const res = await fetch(`${API_URL}/user_orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json","Authorization": `Bearer ${token}` },
      body: JSON.stringify({ order }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Order creation failed");
    }

    return res.json();
  },

  async getUserOrders(user_id: string, token?: string | null) {
    const res = await fetch(`${API_URL}/user_orders/${user_id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Get one order");
    return res.json();
  },

  async deleteOrder(order_id: string, token?: string | null) {
    const res = await fetch(`${API_URL}/user_orders/${order_id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Order deletion failed");
    }

    return res.json();
  },
};
