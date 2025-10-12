// Types for cars
export interface Car {
  id: string; // Изменено с number на string для UUID
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

<<<<<<< HEAD
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
=======
// Types for clients
export interface Client {
  id: string; // Изменено с number на string для UUID
  name: string;
  email: string;
  phone: string;
  totalBookings: number;
  totalSpent: number;
  status: 'vip' | 'regular' | 'new';
  joinDate: string;
  lastBooking: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
}

// Types for bookings
export interface Booking {
  id: string; // Изменено с number на string для UUID
  clientId: string; // Изменено с number на string для UUID
  client: {
    name: string;
    phone: string;
    email: string;
  };
  carId: string; // Изменено с number на string для UUID
  car: string;
>>>>>>> 48d795e0adec41c2ce40d0d904987dab7adb8a3d
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
  id: string; // Изменено с number на string для UUID
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
  id: string; // Изменено с number на string для UUID
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