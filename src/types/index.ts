// Типы для автомобилей
export interface Car {
  id: number;
  name: string;
  model: string;
  year: string;
  category: string;
  pricePerDay: number;
  weeklyPrice?: number;
  monthlyPrice?: number;
  mileage: number;
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

// Типы для клиентов
export interface Client {
  id: number;
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

// Типы для бронирований
export interface Booking {
  id: number;
  clientId: number;
  client: {
    name: string;
    phone: string;
    email: string;
  };
  carId: number;
  car: string;
  startDate: string;
  endDate: string;
  pickupLocation: string;
  returnLocation: string;
  totalPrice: number;
  status: 'confirmed' | 'pending' | 'active' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

// Типы для финансов
export interface FinancialRecord {
  id: number;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: string;
  createdAt: string;
}

// Типы для настроек
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