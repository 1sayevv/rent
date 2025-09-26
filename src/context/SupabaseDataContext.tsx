import React, { createContext, useContext, ReactNode, useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Car, Client, Booking, FinancialRecord, Settings } from "@/types"
import { carsApi } from "@/lib/api/cars"
import { clientsApi } from "@/lib/api/clients"
import { bookingsApi } from "@/lib/api/bookings"
import { financialApi } from "@/lib/api/financial"
import { settingsApi } from "@/lib/api/settings"

interface DataContextType {
  // Cars
  cars: Car[]
  setCars: (cars: Car[] | ((prev: Car[]) => Car[])) => void
  addCar: (car: Omit<Car, "id" | "createdAt" | "updatedAt">) => void
  updateCar: (id: number, car: Partial<Car>) => void
  deleteCar: (id: number) => void

  // Clients
  clients: Client[]
  setClients: (clients: Client[] | ((prev: Client[]) => Client[])) => void
  addClient: (client: Omit<Client, "id" | "createdAt" | "updatedAt">) => void
  updateClient: (id: number, client: Partial<Client>) => void
  deleteClient: (id: number) => void

  // Bookings
  bookings: Booking[]
  setBookings: (bookings: Booking[] | ((prev: Booking[]) => Booking[])) => void
  addBooking: (booking: Omit<Booking, "id" | "createdAt" | "updatedAt">) => void
  updateBooking: (id: number, booking: Partial<Booking>) => void
  deleteBooking: (id: number) => void

  // Financial Records
  financialRecords: FinancialRecord[]
  setFinancialRecords: (records: FinancialRecord[] | ((prev: FinancialRecord[]) => FinancialRecord[])) => void
  addFinancialRecord: (record: Omit<FinancialRecord, "id" | "createdAt">) => void
  updateFinancialRecord: (id: number, record: Partial<FinancialRecord>) => void
  deleteFinancialRecord: (id: number) => void

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

  // Clients
  const { data: clients = [], isLoading: clientsLoading, error: clientsError } = useQuery({
    queryKey: ["clients"],
    queryFn: clientsApi.getAll
  })
  
  const addClientMutation = useMutation({
    mutationFn: clientsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] })
    }
  })
  
  const updateClientMutation = useMutation({
    mutationFn: ({ id, client }: { id: number; client: Partial<Client> }) => clientsApi.update(id, client),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] })
    }
  })
  
  const deleteClientMutation = useMutation({
    mutationFn: clientsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] })
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

  const isLoading = carsLoading || clientsLoading || bookingsLoading || financialLoading || settingsLoading
  const error = carsError || clientsError || bookingsError || financialError || settingsError

  const value: DataContextType = {
    // Cars
    cars,
    setCars: () => {}, // Not used with Supabase
    addCar: (car) => addCarMutation.mutate(car),
    updateCar: (id, car) => updateCarMutation.mutate({ id, car }),
    deleteCar: (id) => deleteCarMutation.mutate(id),

    // Clients
    clients,
    setClients: () => {}, // Not used with Supabase
    addClient: (client) => addClientMutation.mutate(client),
    updateClient: (id, client) => updateClientMutation.mutate({ id, client }),
    deleteClient: (id) => deleteClientMutation.mutate(id),

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
