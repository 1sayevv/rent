import React, { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Car, Client, Booking, FinancialRecord, Settings } from '@/types';

// Initial data
const initialCars: Car[] = [
  {
    id: 1,
    name: "Toyota Camry",
    model: "Camry",
    year: "2023",
    category: "Business",
    pricePerDay: 45,
    mileage: 12500,
    fuelType: "Petrol",
    transmission: "Automatic",
    seats: 5,
    status: "available",
    image: "/placeholder.svg",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01"
  },
  {
    id: 2,
    name: "BMW X5",
    model: "X5",
    year: "2022",
    category: "Premium",
    pricePerDay: 85,
    mileage: 8500,
    fuelType: "Petrol",
    transmission: "Automatic",
    seats: 7,
    status: "rented",
    image: "/placeholder.svg",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01"
  },
  {
    id: 3,
    name: "Mercedes C-Class",
    model: "C-Class",
    year: "2023",
    category: "Premium",
    pricePerDay: 75,
    mileage: 5200,
    fuelType: "Petrol",
    transmission: "Automatic",
    seats: 5,
    status: "available",
    image: "/placeholder.svg",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01"
  },
  {
    id: 4,
    name: "Hyundai Sonata",
    model: "Sonata",
    year: "2022",
    category: "Economy",
    pricePerDay: 35,
    mileage: 18000,
    fuelType: "Petrol",
    transmission: "Automatic",
    seats: 5,
    status: "maintenance",
    image: "/placeholder.svg",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01"
  },
  {
    id: 5,
    name: "Audi Q7",
    model: "Q7",
    year: "2023",
    category: "Premium",
    pricePerDay: 95,
    mileage: 3200,
    fuelType: "Petrol",
    transmission: "Automatic",
    seats: 7,
    status: "available",
    image: "/placeholder.svg",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01"
  },
  {
    id: 6,
    name: "Kia Rio",
    model: "Rio",
    year: "2021",
    category: "Economy", 
    pricePerDay: 25,
    mileage: 32000,
    fuelType: "Petrol",
    transmission: "Manual",
    seats: 5,
    status: "rented",
    image: "/placeholder.svg",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01"
  }
];

const initialClients: Client[] = [
  {
    id: 1,
    name: "Ali Aliyev",
    email: "ali.aliev@email.com",
    phone: "+994 55 123 45 67",
    totalBookings: 12,
    totalSpent: 2340,
    status: "vip",
    joinDate: "2023-03-15",
    lastBooking: "2024-06-10",
    avatar: "/placeholder.svg",
    createdAt: "2023-03-15",
    updatedAt: "2024-06-10"
  },
  {
    id: 2,
    name: "Leyla Mamedova",
    email: "leyla.mamedova@email.com", 
    phone: "+994 50 987 65 43",
    totalBookings: 8,
    totalSpent: 1250,
    status: "regular",
    joinDate: "2023-07-22",
    lastBooking: "2024-06-14",
    avatar: "/placeholder.svg",
    createdAt: "2023-07-22",
    updatedAt: "2024-06-14"
  },
  {
    id: 3,
    name: "Rasim Gasanov",
    email: "rasim.gasanov@email.com",
    phone: "+994 77 555 33 22", 
    totalBookings: 15,
    totalSpent: 3890,
    status: "vip",
    joinDate: "2022-11-08",
    lastBooking: "2024-06-08",
    avatar: "/placeholder.svg",
    createdAt: "2022-11-08",
    updatedAt: "2024-06-08"
  },
  {
    id: 4,
    name: "Nigar Ismayilova",
    email: "nigar.ismayilova@email.com",
    phone: "+994 51 444 77 88",
    totalBookings: 5,
    totalSpent: 680,
    status: "regular",
    joinDate: "2024-01-12",
    lastBooking: "2024-06-13",
    avatar: "/placeholder.svg",
    createdAt: "2024-01-12",
    updatedAt: "2024-06-13"
  },
  {
    id: 5,
    name: "Elchin Kerimov",
    email: "elchin.kerimov@email.com",
    phone: "+994 70 111 22 33",
    totalBookings: 3,
    totalSpent: 420,
    status: "new",
    joinDate: "2024-05-18",
    lastBooking: "2024-06-15",
    avatar: "/placeholder.svg",
    createdAt: "2024-05-18",
    updatedAt: "2024-06-15"
  },
  {
    id: 6,
    name: "Sabina Ahmadova",
    email: "sabina.ahmadova@email.com",
    phone: "+994 55 777 88 99",
    totalBookings: 20,
    totalSpent: 5200,
    status: "vip",
    joinDate: "2022-05-03",
    lastBooking: "2024-06-12",
    avatar: "/placeholder.svg",
    createdAt: "2022-05-03",
    updatedAt: "2024-06-12"
  }
];

const initialBookings: Booking[] = [
  {
    id: 1,
    clientId: 1,
    client: {
      name: "Ali Aliyev",
      phone: "+994 55 123 45 67",
      email: "ali.aliev@email.com"
    },
    carId: 2,
    car: "BMW X5 (2022)",
    startDate: "2024-06-15",
    endDate: "2024-06-20",
    pickupLocation: "Gəyədar Aliyev Airport",
    returnLocation: "Central Office",
    totalPrice: 425,
    status: "confirmed",
    createdAt: "2024-06-10",
    updatedAt: "2024-06-10"
  },
  {
    id: 2,
    clientId: 2,
    client: {
      name: "Leyla Mamedova",
      phone: "+994 50 987 65 43",
      email: "leyla.mamedova@email.com"
    },
    carId: 3,
    car: "Mercedes C-Class (2023)",
    startDate: "2024-06-16",
    endDate: "2024-06-18",
    pickupLocation: "Four Seasons Hotel",
    returnLocation: "Four Seasons Hotel",
    totalPrice: 150,
    status: "pending",
    createdAt: "2024-06-14",
    updatedAt: "2024-06-14"
  },
  {
    id: 3,
    clientId: 3,
    client: {
      name: "Rasim Gasanov",
      phone: "+994 77 555 33 22",
      email: "rasim.gasanov@email.com"
    },
    carId: 1,
    car: "Toyota Camry (2023)",
    startDate: "2024-06-12",
    endDate: "2024-06-16",
    pickupLocation: "Central Office",
    returnLocation: "Gəyədar Aliyev Airport",
    totalPrice: 180,
    status: "active",
    createdAt: "2024-06-08",
    updatedAt: "2024-06-08"
  },
  {
    id: 4,
    clientId: 4,
    client: {
      name: "Nigar Ismayilova",
      phone: "+994 51 444 77 88",
      email: "nigar.ismayilova@email.com"
    },
    carId: 5,
    car: "Audi Q7 (2023)",
    startDate: "2024-06-18",
    endDate: "2024-06-25",
    pickupLocation: "Park Bulvar Shopping Center",
    returnLocation: "Central Office",
    totalPrice: 665,
    status: "confirmed",
    createdAt: "2024-06-13",
    updatedAt: "2024-06-13"
  },
  {
    id: 5,
    clientId: 5,
    client: {
      name: "Elchin Kerimov",
      phone: "+994 70 111 22 33",
      email: "elchin.kerimov@email.com"
    },
    carId: 5,
    car: "Audi Q7 (2023)",
    startDate: "2024-06-20",
    endDate: "2024-06-27",
    pickupLocation: "Gəyədar Aliyev Airport",
    returnLocation: "Gəyədar Aliyev Airport",
    totalPrice: 665,
    status: "pending",
    createdAt: "2024-06-15",
    updatedAt: "2024-06-15"
  }
];

const initialSettings: Settings = {
  companyName: "Auto Manage Suite",
  companyEmail: "info@automanage.az",
  companyPhone: "+994 12 345 67 89",
  companyAddress: "Baku, Azerbaijan",
  currency: "₼",
  timezone: "Asia/Baku",
  language: "ru",
  notifications: {
    email: true,
    sms: false,
    push: true
  }
};

interface DataContextType {
  // Cars
  cars: Car[];
  setCars: (cars: Car[] | ((prev: Car[]) => Car[])) => void;
  addCar: (car: Omit<Car, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCar: (id: number, car: Partial<Car>) => void;
  deleteCar: (id: number) => void;
  
  // Clients
  clients: Client[];
  setClients: (clients: Client[] | ((prev: Client[]) => Client[])) => void;
  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateClient: (id: number, client: Partial<Client>) => void;
  deleteClient: (id: number) => void;
  
  // Bookings
  bookings: Booking[];
  setBookings: (bookings: Booking[] | ((prev: Booking[]) => Booking[])) => void;
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateBooking: (id: number, booking: Partial<Booking>) => void;
  deleteBooking: (id: number) => void;
  
  // Financial Records
  financialRecords: FinancialRecord[];
  setFinancialRecords: (records: FinancialRecord[] | ((prev: FinancialRecord[]) => FinancialRecord[])) => void;
  addFinancialRecord: (record: Omit<FinancialRecord, 'id' | 'createdAt'>) => void;
  updateFinancialRecord: (id: number, record: Partial<FinancialRecord>) => void;
  deleteFinancialRecord: (id: number) => void;
  
  // Settings
  settings: Settings;
  setSettings: (settings: Settings | ((prev: Settings) => Settings)) => void;
  updateSettings: (settings: Partial<Settings>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cars, setCars] = useLocalStorage<Car[]>('cars', initialCars);
  const [clients, setClients] = useLocalStorage<Client[]>('clients', initialClients);
  const [bookings, setBookings] = useLocalStorage<Booking[]>('bookings', initialBookings);
  const [financialRecords, setFinancialRecords] = useLocalStorage<FinancialRecord[]>('financialRecords', []);
  const [settings, setSettings] = useLocalStorage<Settings>('settings', initialSettings);

  // Functions for working with cars
  const addCar = (carData: Omit<Car, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCar: Car = {
      ...carData,
      id: Math.max(...cars.map(c => c.id), 0) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setCars(prev => [...prev, newCar]);
  };

  const updateCar = (id: number, carData: Partial<Car>) => {
    setCars(prev => prev.map(car => 
      car.id === id 
        ? { ...car, ...carData, updatedAt: new Date().toISOString() }
        : car
    ));
  };

  const deleteCar = (id: number) => {
    setCars(prev => prev.filter(car => car.id !== id));
  };

  // Functions for working with clients
  const addClient = (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newClient: Client = {
      ...clientData,
      id: Math.max(...clients.map(c => c.id), 0) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setClients(prev => [...prev, newClient]);
  };

  const updateClient = (id: number, clientData: Partial<Client>) => {
    setClients(prev => prev.map(client => 
      client.id === id 
        ? { ...client, ...clientData, updatedAt: new Date().toISOString() }
        : client
    ));
  };

  const deleteClient = (id: number) => {
    setClients(prev => prev.filter(client => client.id !== id));
  };

  // Functions for working with bookings
  const addBooking = (bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newBooking: Booking = {
      ...bookingData,
      id: Math.max(...bookings.map(b => b.id), 0) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setBookings(prev => [...prev, newBooking]);
  };

  const updateBooking = (id: number, bookingData: Partial<Booking>) => {
    setBookings(prev => prev.map(booking => 
      booking.id === id 
        ? { ...booking, ...bookingData, updatedAt: new Date().toISOString() }
        : booking
    ));
  };

  const deleteBooking = (id: number) => {
    setBookings(prev => prev.filter(booking => booking.id !== id));
  };

  // Functions for working with financial records
  const addFinancialRecord = (recordData: Omit<FinancialRecord, 'id' | 'createdAt'>) => {
    const newRecord: FinancialRecord = {
      ...recordData,
      id: Math.max(...financialRecords.map(r => r.id), 0) + 1,
      createdAt: new Date().toISOString()
    };
    setFinancialRecords(prev => [...prev, newRecord]);
  };

  const updateFinancialRecord = (id: number, recordData: Partial<FinancialRecord>) => {
    setFinancialRecords(prev => prev.map(record => 
      record.id === id 
        ? { ...record, ...recordData }
        : record
    ));
  };

  const deleteFinancialRecord = (id: number) => {
    setFinancialRecords(prev => prev.filter(record => record.id !== id));
  };

  // Functions for working with settings
  const updateSettings = (settingsData: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...settingsData }));
  };

  const value: DataContextType = {
    cars,
    setCars,
    addCar,
    updateCar,
    deleteCar,
    clients,
    setClients,
    addClient,
    updateClient,
    deleteClient,
    bookings,
    setBookings,
    addBooking,
    updateBooking,
    deleteBooking,
    financialRecords,
    setFinancialRecords,
    addFinancialRecord,
    updateFinancialRecord,
    deleteFinancialRecord,
    settings,
    setSettings,
    updateSettings
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}; 