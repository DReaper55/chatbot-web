const API_URL = process.env.API_URL || "http://localhost:8000";

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
