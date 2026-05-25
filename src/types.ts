export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'Administrator' | 'Editor' | 'Support Agent' | 'User';
  status: 'Active' | 'Suspended' | 'Inactive';
  lastActive: string;
  location: string;
  joinDate: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  price: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  ordersCount: number;
  rating: number;
}

export interface OrderItem {
  id: string;
  productName: string;
  qty: number;
  price: number;
}

export interface Order {
  id: string;
  customerName: string;
  email: string;
  avatar: string;
  date: string;
  amount: number;
  status: 'Delivered' | 'Processing' | 'Pending' | 'Cancelled';
  items: OrderItem[];
  shippingAddress: string;
  paymentMethod: string;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  category: 'audit' | 'security' | 'general' | 'billing';
  message: string;
  description: string;
  timestamp: string;
  read: boolean;
}

export interface ActivityEvent {
  id: string;
  user: string;
  avatar: string;
  action: string;
  detail: string;
  type: 'info' | 'success' | 'warning' | 'error';
  time: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'work' | 'private' | 'urgent' | 'system';
  color: string;
}

export interface DashboardStats {
  totalRevenue: { value: number; change: number; series: number[] };
  activeUsers: { value: number; change: number; series: number[] };
  totalSales: { value: number; change: number; series: number[] };
  conversionRate: { value: number; change: number; series: number[] };
}
