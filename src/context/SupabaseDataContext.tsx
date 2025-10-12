import React, { createContext, useContext, ReactNode, useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Car, Booking, FinancialRecord, Settings } from "@/types"
import { carsApi } from "@/lib/api/cars"
import { bookingsApi } from "@/lib/api/bookings"
import { financialApi } from "@/lib/api/financial"
import { settingsApi } from "@/lib/api/settings"

interface DataContextType {
  // Cars
  cars: Car[]
  setCars: (cars: Car[] | ((prev: Car[]) => Car[])) => void
  addCar: (car: Omit<Car, "id" | "createdAt" | "updatedAt">) => void
  updateCar: (id: string, car: Partial<Car>) => void
  deleteCar: (id: string) => void

<<<<<<< HEAD
=======
  // Clients
  clients: Client[]
  setClients: (clients: Client[] | ((prev: Client[]) => Client[])) => void
  addClient: (client: Omit<Client, "id" | "createdAt" | "updatedAt">) => void
  updateClient: (id: string, client: Partial<Client>) => void
  deleteClient: (id: string) => void

>>>>>>> 48d795e0adec41c2ce40d0d904987dab7adb8a3d
  // Bookings
  bookings: Booking[]
  setBookings: (bookings: Booking[] | ((prev: Booking[]) => Booking[])) => void
  addBooking: (booking: Omit<Booking, "id" | "createdAt" | "updatedAt">) => void
  updateBooking: (id: string, booking: Partial<Booking>) => void
  deleteBooking: (id: string) => void

  // Financial Records
  financialRecords: FinancialRecord[]
  setFinancialRecords: (records: FinancialRecord[] | ((prev: FinancialRecord[]) => FinancialRecord[])) => void
  addFinancialRecord: (record: Omit<FinancialRecord, "id" | "createdAt">) => void
  updateFinancialRecord: (id: string, record: Partial<FinancialRecord>) => void
  deleteFinancialRecord: (id: string) => void

  // Settings
  settings: Settings
  setSettings: (settings: Settings | ((prev: Settings) => Settings)) => void
  updateSettings: (settings: Partial<Settings>) => void

  // Loading states
  isLoading: boolean
  error: Error | null
}

const DataContext = createContext<DataContextType | undefined>(undefined)

const defaultSettings: Settings = {
  companyName: "Auto Manage Suite",
  companyEmail: "info@automanage.az",
  companyPhone: "+994 12 345 67 89",
  companyAddress: "Baku, Azerbaijan",
  currency: "?",
  timezone: "Asia/Baku",
  language: "ru",
  notifications: {
    email: true,
    sms: false,
    push: true
  }
}

export const SupabaseDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient()
  
  // Cars
  const { data: cars = [], isLoading: carsLoading, error: carsError } = useQuery({
    queryKey: ["cars"],
    queryFn: carsApi.getAll
  })
  
  const addCarMutation = useMutation({
    mutationFn: carsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cars"] })
    }
  })
  
  const updateCarMutation = useMutation({
    mutationFn: ({ id, car }: { id: number; car: Partial<Car> }) => carsApi.update(id, car),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cars"] })
    }
  })
  
  const deleteCarMutation = useMutation({
    mutationFn: carsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cars"] })
    }
  })

  // Bookings
  const { data: bookings = [], isLoading: bookingsLoading, error: bookingsError } = useQuery({
    queryKey: ["bookings"],
    queryFn: bookingsApi.getAll
  })
  
  const addBookingMutation = useMutation({
    mutationFn: bookingsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] })
    }
  })
  
  const updateBookingMutation = useMutation({
    mutationFn: ({ id, booking }: { id: number; booking: Partial<Booking> }) => bookingsApi.update(id, booking),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] })
    }
  })
  
  const deleteBookingMutation = useMutation({
    mutationFn: bookingsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] })
    }
  })

  // Financial Records
  const { data: financialRecords = [], isLoading: financialLoading, error: financialError } = useQuery({
    queryKey: ["financial"],
    queryFn: financialApi.getAll
  })
  
  const addFinancialMutation = useMutation({
    mutationFn: financialApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial"] })
    }
  })
  
  const updateFinancialMutation = useMutation({
    mutationFn: ({ id, record }: { id: number; record: Partial<FinancialRecord> }) => financialApi.update(id, record),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial"] })
    }
  })
  
  const deleteFinancialMutation = useMutation({
    mutationFn: financialApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial"] })
    }
  })

  // Settings
  const { data: settings = defaultSettings, isLoading: settingsLoading, error: settingsError } = useQuery({
    queryKey: ["settings"],
    queryFn: settingsApi.get,
    retry: false
  })
  
  const updateSettingsMutation = useMutation({
    mutationFn: settingsApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] })
    }
  })

  const isLoading = carsLoading || bookingsLoading || financialLoading || settingsLoading
  const error = carsError || bookingsError || financialError || settingsError

  const value: DataContextType = {
    // Cars
    cars,
    setCars: () => {}, // Not used with Supabase
    addCar: (car) => addCarMutation.mutate(car),
    updateCar: (id, car) => updateCarMutation.mutate({ id, car }),
    deleteCar: (id) => deleteCarMutation.mutate(id),

    // Bookings
    bookings,
    setBookings: () => {}, // Not used with Supabase
    addBooking: (booking) => addBookingMutation.mutate(booking),
    updateBooking: (id, booking) => updateBookingMutation.mutate({ id, booking }),
    deleteBooking: (id) => deleteBookingMutation.mutate(id),

    // Financial Records
    financialRecords,
    setFinancialRecords: () => {}, // Not used with Supabase
    addFinancialRecord: (record) => addFinancialMutation.mutate(record),
    updateFinancialRecord: (id, record) => updateFinancialMutation.mutate({ id, record }),
    deleteFinancialRecord: (id) => deleteFinancialMutation.mutate(id),

    // Settings
    settings,
    setSettings: () => {}, // Not used with Supabase
    updateSettings: (settings) => updateSettingsMutation.mutate(settings),

    // Loading states
    isLoading,
    error: error as Error | null
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export const useData = () => {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a SupabaseDataProvider")
  }
  return context
}
