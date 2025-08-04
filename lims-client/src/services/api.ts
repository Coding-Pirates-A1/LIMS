import {
  User,
  Component,
  InventoryMovement,
  Notification,
  DashboardMetrics,
  ComponentCategory,
} from "../types";

// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Mock data for demonstration
const mockComponents: Component[] = [
  {
    id: "1",
    name: "Carbon Film Resistor",
    manufacturer: "Yageo",
    partNumber: "CFR-25JB-52-10K",
    description: "10kΩ ±5% 1/4W Carbon Film Resistor",
    quantity: 1500,
    location: "A1-B2",
    unitPrice: 0.05,
    datasheetLink: "https://example.com/datasheet1",
    category: "Resistors",
    criticalLowThreshold: 100,
    createdAt: "2024-01-15T08:30:00Z",
    lastMovement: "2024-12-01T14:20:00Z",
  },
  {
    id: "2",
    name: "Ceramic Capacitor",
    manufacturer: "Murata",
    partNumber: "GCM188R71H104KA57D",
    description: "100nF 50V X7R Ceramic Capacitor",
    quantity: 25,
    location: "A2-C1",
    unitPrice: 0.12,
    category: "Capacitors",
    criticalLowThreshold: 50,
    createdAt: "2024-09-10T10:15:00Z",
    lastMovement: "2024-12-28T09:45:00Z",
  },
  {
    id: "3",
    name: "Operational Amplifier",
    manufacturer: "Texas Instruments",
    partNumber: "LM358N",
    description: "Dual Low-Power Operational Amplifier",
    quantity: 80,
    location: "B1-A3",
    unitPrice: 0.85,
    category: "ICs",
    criticalLowThreshold: 20,
    createdAt: "2024-06-20T16:45:00Z",
    lastMovement: "2024-12-20T11:30:00Z",
  },
];

const mockUsers: User[] = [
  {
    id: "1",
    username: "admin",
    email: "admin@lab.com",
    role: "admin",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    username: "tech1",
    email: "tech1@lab.com",
    role: "user",
    createdAt: "2024-01-02T00:00:00Z",
  },
];

const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const authAPI = {
  async login(
    username: string,
    password: string
  ): Promise<{ user: User; token: string }> {
    await delay(500);

    // Mock authentication
    if (username === "admin" && password === "admin123") {
      return {
        user: mockUsers[0],
        token: "mock-admin-token",
      };
    } else if (username === "tech1" && password === "tech123") {
      return {
        user: mockUsers[1],
        token: "mock-user-token",
      };
    }

    throw new Error("Invalid credentials");
  },

  async validateToken(token: string): Promise<User> {
    await delay(200);

    if (token === "mock-admin-token") {
      return mockUsers[0];
    } else if (token === "mock-user-token") {
      return mockUsers[1];
    }

    throw new Error("Invalid token");
  },
};

export const componentsAPI = {
  async getAll(): Promise<Component[]> {
    await delay(300);
    return mockComponents;
  },

  async getById(id: string): Promise<Component> {
    await delay(200);
    const component = mockComponents.find((c) => c.id === id);
    if (!component) throw new Error("Component not found");
    return component;
  },

  async create(
    component: Omit<Component, "id" | "createdAt">
  ): Promise<Component> {
    await delay(400);
    const newComponent: Component = {
      ...component,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
    mockComponents.push(newComponent);
    return newComponent;
  },

  async update(id: string, updates: Partial<Component>): Promise<Component> {
    await delay(300);
    const index = mockComponents.findIndex((c) => c.id === id);
    if (index === -1) throw new Error("Component not found");

    mockComponents[index] = { ...mockComponents[index], ...updates };
    return mockComponents[index];
  },

  async delete(id: string): Promise<void> {
    await delay(300);
    const index = mockComponents.findIndex((c) => c.id === id);
    if (index === -1) throw new Error("Component not found");
    mockComponents.splice(index, 1);
  },

  async search(filters: any): Promise<Component[]> {
    await delay(250);
    return mockComponents.filter((component) => {
      if (
        filters.query &&
        !component.name.toLowerCase().includes(filters.query.toLowerCase()) &&
        !component.partNumber
          .toLowerCase()
          .includes(filters.query.toLowerCase())
      ) {
        return false;
      }
      if (filters.category && component.category !== filters.category) {
        return false;
      }
      if (
        filters.location &&
        !component.location
          .toLowerCase()
          .includes(filters.location.toLowerCase())
      ) {
        return false;
      }
      if (filters.minQuantity && component.quantity < filters.minQuantity) {
        return false;
      }
      if (filters.maxQuantity && component.quantity > filters.maxQuantity) {
        return false;
      }
      return true;
    });
  },
};

export const inventoryAPI = {
  async recordMovement(
    movement: Omit<InventoryMovement, "id" | "timestamp">
  ): Promise<InventoryMovement> {
    await delay(400);
    const newMovement: InventoryMovement = {
      ...movement,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
    };
    return newMovement;
  },

  async getMovements(componentId?: string): Promise<InventoryMovement[]> {
    await delay(300);
    // Mock movements data
    return [];
  },
};

export const notificationsAPI = {
  async getAll(): Promise<Notification[]> {
    await delay(300);
    return [
      {
        id: "1",
        type: "low_stock",
        componentId: "2",
        componentName: "Ceramic Capacitor",
        message: "Stock level is below critical threshold (25 remaining)",
        timestamp: new Date().toISOString(),
        read: false,
      },
      {
        id: "2",
        type: "old_stock",
        componentId: "1",
        componentName: "Carbon Film Resistor",
        message: "Component has been in inventory for over 3 months",
        timestamp: new Date().toISOString(),
        read: false,
      },
    ];
  },

  async markAsRead(id: string): Promise<void> {
    await delay(200);
  },
};

export const dashboardAPI = {
  async getMetrics(): Promise<DashboardMetrics> {
    await delay(400);
    return {
      totalComponents: mockComponents.length,
      lowStockCount: 1,
      oldStockCount: 1,
      totalValue: mockComponents.reduce(
        (sum, c) => sum + c.quantity * c.unitPrice,
        0
      ),
      monthlyInward: [
        { month: "2024-08", count: 12, quantity: 450 },
        { month: "2024-09", count: 8, quantity: 320 },
        { month: "2024-10", count: 15, quantity: 580 },
        { month: "2024-11", count: 22, quantity: 750 },
        { month: "2024-12", count: 18, quantity: 620 },
      ],
      monthlyOutward: [
        { month: "2024-08", count: 8, quantity: 280 },
        { month: "2024-09", count: 12, quantity: 410 },
        { month: "2024-10", count: 10, quantity: 350 },
        { month: "2024-11", count: 16, quantity: 520 },
        { month: "2024-12", count: 14, quantity: 480 },
      ],
      categoryDistribution: [
        { category: "Resistors", count: 45 },
        { category: "Capacitors", count: 38 },
        { category: "ICs", count: 22 },
        { category: "Semiconductors", count: 18 },
        { category: "Connectors", count: 15 },
      ],
    };
  },
};

export const usersAPI = {
  async getAll(): Promise<User[]> {
    await delay(300);
    return mockUsers;
  },

  async create(user: Omit<User, "id" | "createdAt">): Promise<User> {
    await delay(400);
    const newUser: User = {
      ...user,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
    mockUsers.push(newUser);
    return newUser;
  },

  async update(id: string, updates: Partial<User>): Promise<User> {
    await delay(300);
    const index = mockUsers.findIndex((u) => u.id === id);
    if (index === -1) throw new Error("User not found");

    mockUsers[index] = { ...mockUsers[index], ...updates };
    return mockUsers[index];
  },

  async delete(id: string): Promise<void> {
    await delay(300);
    const index = mockUsers.findIndex((u) => u.id === id);
    if (index === -1) throw new Error("User not found");
    mockUsers.splice(index, 1);
  },
};
