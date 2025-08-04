import {
  User,
  Component,
  InventoryMovement,
  Notification,
  DashboardMetrics,
} from "../types";

const API_BASE_URL = "http://localhost:5000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const authAPI = {
  async login(
    username: string,
    password: string
  ): Promise<{ user: User; token: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) throw new Error("Invalid credentials");
    return await response.json();
  },

  async register(
    username: string,
    email: string,
    password: string,
    role?: string
  ): Promise<{ user: User; token: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password, role: "admin" }),
    });

    if (!response.ok) throw new Error("Registration failed");
    return await response.json();
  },

  async validateToken(token: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/validate`, {
      method: "GET",
      headers: {
        ...getAuthHeaders(),
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Invalid token");
    return await response.json();
  },
};

export const componentsAPI = {
  async getAll(): Promise<Component[]> {
    const response = await fetch(`${API_BASE_URL}/components`, {
      headers: getAuthHeaders(),
    });
    return await response.json();
  },

  async getById(id: string): Promise<Component> {
    const response = await fetch(`${API_BASE_URL}/components/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Component not found");
    return await response.json();
  },

  async create(component: Partial<Component>): Promise<Component> {
    const response = await fetch(`${API_BASE_URL}/components`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(component),
    });
    return await response.json();
  },

  async update(id: string, updates: Partial<Component>): Promise<Component> {
    const response = await fetch(`${API_BASE_URL}/components/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    return await response.json();
  },

  async delete(id: string): Promise<void> {
    await fetch(`${API_BASE_URL}/components/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
  },

  async search(filters: any): Promise<Component[]> {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetch(
      `${API_BASE_URL}/components/search?${queryParams}`,
      {
        headers: getAuthHeaders(),
      }
    );
    return await response.json();
  },
};

export const inventoryAPI = {
  async recordMovement(
    movement: Partial<InventoryMovement>
  ): Promise<InventoryMovement> {
    const response = await fetch(`${API_BASE_URL}/inventory/movements`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(movement),
    });
    return await response.json();
  },

  async getMovements(componentId?: string): Promise<InventoryMovement[]> {
    const url = componentId
      ? `${API_BASE_URL}/inventory/movements?componentId=${componentId}`
      : `${API_BASE_URL}/inventory/movements`;
    const response = await fetch(url, { headers: getAuthHeaders() });
    return await response.json();
  },
};

export const notificationsAPI = {
  async getAll(): Promise<Notification[]> {
    const response = await fetch(`${API_BASE_URL}/notifications`, {
      headers: getAuthHeaders(),
    });
    return await response.json();
  },

  async markAsRead(id: string): Promise<void> {
    await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
      method: "PATCH",
      headers: getAuthHeaders(),
    });
  },
};

export const dashboardAPI = {
  async getMetrics(): Promise<DashboardMetrics> {
    const response = await fetch(`${API_BASE_URL}/dashboard/metrics`, {
      headers: getAuthHeaders(),
    });
    return await response.json();
  },
};

export const usersAPI = {
  async getAll(): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: getAuthHeaders(),
    });
    return await response.json();
  },

  async create(user: Partial<User>): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(user),
    });
    return await response.json();
  },

  async update(id: string, updates: Partial<User>): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    return await response.json();
  },

  async delete(id: string): Promise<void> {
    await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
  },
};
