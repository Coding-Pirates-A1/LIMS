export interface User {
  id: string;
  username: string;
  email: string;
  role: "admin" | "user";
  createdAt: string;
}

export interface Component {
  id: string;
  name: string;
  manufacturer: string;
  partNumber: string;
  description: string;
  quantity: number;
  location: string;
  unitPrice: number;
  datasheetLink?: string;
  category: ComponentCategory;
  criticalLowThreshold: number;
  createdAt: string;
  lastMovement?: string;
}

export interface InventoryMovement {
  id: string;
  componentId: string;
  type: "inward" | "outward";
  quantity: number;
  userId: string;
  username: string;
  reason: string;
  project?: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  type: "low_stock" | "old_stock";
  componentId: string;
  componentName: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export type ComponentCategory =
  | "Resistors"
  | "Capacitors"
  | "Inductors"
  | "Semiconductors"
  | "ICs"
  | "Connectors"
  | "Sensors"
  | "Tools"
  | "PCBs"
  | "Other";

export interface DashboardMetrics {
  totalComponents: number;
  lowStockCount: number;
  oldStockCount: number;
  totalValue: number;
  monthlyInward: Array<{ month: string; count: number; quantity: number }>;
  monthlyOutward: Array<{ month: string; count: number; quantity: number }>;
  categoryDistribution: Array<{ category: string; count: number }>;
}

export interface SearchFilters {
  query: string;
  category: ComponentCategory | "";
  location: string;
  minQuantity: number;
  maxQuantity: number;
}
