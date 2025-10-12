// Types for cars
export interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  color: string;
  plateNumber: string;
  dailyRate: number;
  ownerRate: number;
  insurancePrice: number;
  isAvailable: boolean;
  description?: string;
  imageUrl?: string;
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

// Types for monthly expenses
export interface MonthlyExpense {
  id: number;
  name: string;
  amount: number;
  date: string;
  description?: string;
  isRecurring: boolean;
  createdAt: string;
}

// Types for users and roles
export type UserRole = 'admin' | 'manager';

export interface User {
  id: string;
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