// User Types
export interface User {
  id: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  RIDER = 'RIDER',
  RESTAURANT = 'RESTAURANT',
  ADMIN = 'ADMIN'
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED'
}

// Customer Types
export interface Customer {
  id: string;
  userId: string;
  user: User;
  addresses: CustomerAddress[];
  orders: Order[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomerAddress {
  id: string;
  customerId: string;
  label: string;
  address: string;
  latitude?: number;
  longitude?: number;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Rider Types
export interface Rider {
  id: string;
  userId: string;
  user: User;
  licenseNumber?: string;
  vehicleType?: string;
  vehicleNumber?: string;
  bankAccount?: string;
  bankName?: string;
  status: RiderStatus;
  currentLat?: number;
  currentLng?: number;
  rating: number;
  totalRides: number;
  orders: Order[];
  createdAt: Date;
  updatedAt: Date;
}

export enum RiderStatus {
  OFFLINE = 'OFFLINE',
  ONLINE = 'ONLINE',
  BUSY = 'BUSY'
}

// Restaurant Status Enum
export type RestaurantStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';

// Restaurant Types
export interface Restaurant {
  id: string;
  userId: string;
  user: User;
  name: string;
  description?: string;
  address: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  image?: string;
  rating: number;
  isOpen: boolean;
  openTime?: string;
  closeTime?: string;
  status: RestaurantStatus;
  approvedAt?: Date;
  approvedBy?: string;
  rejectedAt?: Date;
  rejectedBy?: string;
  rejectReason?: string;
  categories: Category[];
  menuItems: MenuItem[];
  orders: Order[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  restaurantId: string;
  restaurant: Restaurant;
  name: string;
  description?: string;
  image?: string;
  order: number;
  menuItems: MenuItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  restaurant: Restaurant;
  categoryId?: string;
  category?: Category;
  name: string;
  description?: string;
  price: number;
  image?: string;
  isAvailable: boolean;
  orderItems: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

// Order Types
export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customer: Customer;
  restaurantId: string;
  restaurant: Restaurant;
  riderId?: string;
  rider?: Rider;
  addressId: string;
  address: CustomerAddress;
  status: OrderStatus;
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  total: number;
  specialInstructions?: string;
  estimatedDelivery?: Date;
  confirmedAt?: Date;
  preparedAt?: Date;
  pickedUpAt?: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;
  orderItems: OrderItem[];
  notifications: Notification[];
  createdAt: Date;
  updatedAt: Date;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  READY_FOR_PICKUP = 'READY_FOR_PICKUP',
  PICKED_UP = 'PICKED_UP',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export interface OrderItem {
  id: string;
  orderId: string;
  order: Order;
  menuItemId: string;
  menuItem: MenuItem;
  quantity: number;
  price: number;
  total: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Notification Types
export interface Notification {
  id: string;
  orderId?: string;
  order?: Order;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  data?: any;
  createdAt: Date;
  updatedAt: Date;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
}

// Cart Types
export interface CartItem {
  menuItemId: string;
  menuItem: MenuItem;
  quantity: number;
  notes?: string;
}

export interface Cart {
  restaurantId: string;
  restaurant: Restaurant;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  total: number;
}

// Location Types
export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

// Socket.io Event Types
export interface SocketEvents {
  // Order Events
  'order:created': (order: Order) => void;
  'order:updated': (order: Order) => void;
  'order:status_changed': (orderId: string, status: OrderStatus) => void;
  
  // Rider Events
  'rider:location_updated': (riderId: string, location: Location) => void;
  'rider:status_changed': (riderId: string, status: RiderStatus) => void;
  
  // Notification Events
  'notification:new': (notification: Notification) => void;
  'notification:read': (notificationId: string) => void;
} 