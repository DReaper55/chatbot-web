const API_URL = process.env.PYTHON_BACKEND_URL || "http://localhost:8000";

export const usersDB = {
  async getUserByUsername(username: string) {
    const res = await fetch(`${API_URL}/users/${username}`);
    if (!res.ok) throw new Error("User not found");
    return res.json();
  },

  async createUser(username: string, password: string) {
    const res = await fetch(`${API_URL}/users/signup`, {
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
    const res = await fetch(`${API_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) throw new Error("Invalid credentials");

    return res.json();
  },
};
