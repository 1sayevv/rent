// Types for cars
export interface Car {
  id: number;
  name: string;
  model: string;
  year: string;
  category: string;
  pricePerDay: number;
  fuelType: string;
  transmission: string;
  seats: number;
  status: 'available' | 'rented' | 'maintenance' | 'unavailable';
  description?: string;
  image: string;
  images?: string[];
  createdAt: string;
  updatedAt: string;
}

// Types for bookings
export interface Booking {
  id: number;
  // Customer Information
  customerName: string;
  customerCountry: string;
  customerPhone: string;
  
  // Car Information
  carId: number;
  carName: string;
  
  // Rental Dates
  startDate: string;
  endDate: string;
  rentalDays: number;
  
  // Delivery Options
  deliveryToAirport: boolean;
  deliveryToHotel: boolean;
  deliveryLocation?: string;
  
  // Insurance
  fullInsurance: boolean;
  
  // Financial Details
  totalAmount: number;
  dailyRate: number;
  ownerAmount: number;
  myIncome: number;
  
  // Additional Details
  pickupLocation: string;
  returnLocation: string;
  notes?: string;
  
  status: 'confirmed' | 'pending' | 'active' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

// Types for finances
export interface FinancialRecord {
  id: number;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: string;
  createdAt: string;
}

// Types for settings
export interface Settings {
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  currency: string;
  timezone: string;
  language: string;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

// Types for users and roles
export type UserRole = 'admin' | 'manager';

export interface User {
  id: number;
  email: string;
  role: UserRole;
  name: string;
  createdAt: string;
}

// Types for permissions
export interface Permission {
  resource: string;
  actions: string[];
}

export interface RolePermissions {
  admin: Permission[];
  manager: Permission[];
} 