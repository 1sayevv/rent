import React, { createContext, useContext, ReactNode } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Car, Booking, MonthlyExpense } from "@/types"
import { carsApi } from "@/lib/api/cars"
import { bookingsApi } from "@/lib/api/bookings"
import { financialApi } from "@/lib/api/financial"

interface DataContextType {
  // Cars
  cars: Car[]
  setCars: (cars: Car[] | ((prev: Car[]) => Car[])) => void
  addCar: (car: Omit<Car, "id" | "createdAt" | "updatedAt">) => void
  updateCar: (id: number, car: Partial<Car>) => void
  deleteCar: (id: number) => void

  // Bookings
  bookings: Booking[]
  setBookings: (bookings: Booking[] | ((prev: Booking[]) => Booking[])) => void
  addBooking: (booking: Omit<Booking, "id" | "createdAt" | "updatedAt">) => void
  updateBooking: (id: number, booking: Partial<Booking>) => void
  deleteBooking: (id: number) => void

  // Monthly Expenses
  monthlyExpenses: MonthlyExpense[]
  setMonthlyExpenses: (expenses: MonthlyExpense[] | ((prev: MonthlyExpense[]) => MonthlyExpense[])) => void
  addMonthlyExpense: (expense: Omit<MonthlyExpense, "id" | "createdAt">) => void
  updateMonthlyExpense: (id: number, expense: Partial<MonthlyExpense>) => void
  deleteMonthlyExpense: (id: number) => void

  // Loading states
  isLoading: boolean
  error: Error | null
}

const DataContext = createContext<DataContextType | undefined>(undefined)

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

  // Monthly Expenses
  const { data: monthlyExpenses = [], isLoading: expensesLoading, error: expensesError } = useQuery({
    queryKey: ["monthlyExpenses"],
    queryFn: financialApi.getAllExpenses
  })
  
  const addMonthlyExpenseMutation = useMutation({
    mutationFn: financialApi.createExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["monthlyExpenses"] })
    }
  })
  
  const updateMonthlyExpenseMutation = useMutation({
    mutationFn: ({ id, expense }: { id: number; expense: Partial<MonthlyExpense> }) => financialApi.updateExpense(id, expense),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["monthlyExpenses"] })
    }
  })
  
  const deleteMonthlyExpenseMutation = useMutation({
    mutationFn: financialApi.deleteExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["monthlyExpenses"] })
    }
  })

  const isLoading = carsLoading || bookingsLoading || expensesLoading
  const error = carsError || bookingsError || expensesError

  const value: DataContextType = {
    // Cars
    cars,
    setCars: () => {
      // Not used with Supabase - read only from backend
    },
    addCar: (car: Omit<Car, "id" | "createdAt" | "updatedAt">) => {
      addCarMutation.mutate(car)
    },
    updateCar: (id: number, car: Partial<Car>) => {
      updateCarMutation.mutate({ id, car })
    },
    deleteCar: (id: number) => {
      deleteCarMutation.mutate(id)
    },

    // Bookings
    bookings,
    setBookings: () => {
      // Not used with Supabase - read only from backend
    },
    addBooking: (booking: Omit<Booking, "id" | "createdAt" | "updatedAt">) => {
      addBookingMutation.mutate(booking)
    },
    updateBooking: (id: number, booking: Partial<Booking>) => {
      updateBookingMutation.mutate({ id, booking })
    },
    deleteBooking: (id: number) => {
      deleteBookingMutation.mutate(id)
    },

    // Monthly Expenses
    monthlyExpenses,
    setMonthlyExpenses: () => {
      // Not used with Supabase - read only from backend
    },
    addMonthlyExpense: (expense: Omit<MonthlyExpense, "id" | "createdAt">) => {
      addMonthlyExpenseMutation.mutate(expense)
    },
    updateMonthlyExpense: (id: number, expense: Partial<MonthlyExpense>) => {
      updateMonthlyExpenseMutation.mutate({ id, expense })
    },
    deleteMonthlyExpense: (id: number) => {
      deleteMonthlyExpenseMutation.mutate(id)
    },

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
