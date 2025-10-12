import { supabase } from '@/lib/supabase'
import { MonthlyExpense, Booking } from '@/types'

export interface DashboardStats {
  totalRevenue: number
  myIncome: number
  ownerIncome: number
  totalBookings: number
  activeBookings: number
  completedBookings: number
  totalRentalDays: number
  averageBookingValue: number
}

export interface CarPerformance {
  carId: number
  carName: string
  totalDays: number
  bookingCount: number
  totalRevenue: number
  myIncome: number
  ownerIncome: number
  averageDailyRate: number
}

export interface PeriodRevenue {
  period: string
  totalRevenue: number
  myIncome: number
  ownerIncome: number
  bookingCount: number
}

export const financialApi = {
  // Monthly Expenses Management
  async getAllExpenses(): Promise<MonthlyExpense[]> {
    const { data, error } = await supabase
      .from('monthly_expenses')
      .select('*')
      .order('date', { ascending: false })
    
    if (error) throw error
    
    return data.map(expense => ({
      id: expense.id,
      name: expense.name,
      amount: expense.amount,
      date: expense.date,
      description: expense.description,
      isRecurring: expense.is_recurring,
      createdAt: expense.created_at
    }))
  },

  async createExpense(expense: Omit<MonthlyExpense, 'id' | 'createdAt'>): Promise<MonthlyExpense> {
    const { data, error } = await supabase
      .from('monthly_expenses')
      .insert({
        name: expense.name,
        amount: expense.amount,
        date: expense.date,
        description: expense.description,
        is_recurring: expense.isRecurring
      })
      .select()
      .single()
    
    if (error) throw error
    
    return {
      id: data.id,
      name: data.name,
      amount: data.amount,
      date: data.date,
      description: data.description,
      isRecurring: data.is_recurring,
      createdAt: data.created_at
    }
  },

  async updateExpense(id: number, expense: Partial<MonthlyExpense>): Promise<MonthlyExpense> {
    const updateData: any = {}
    
    if (expense.name !== undefined) updateData.name = expense.name
    if (expense.amount !== undefined) updateData.amount = expense.amount
    if (expense.date !== undefined) updateData.date = expense.date
    if (expense.description !== undefined) updateData.description = expense.description
    if (expense.isRecurring !== undefined) updateData.is_recurring = expense.isRecurring
    
    const { data, error } = await supabase
      .from('monthly_expenses')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    
    return {
      id: data.id,
      name: data.name,
      amount: data.amount,
      date: data.date,
      description: data.description,
      isRecurring: data.is_recurring,
      createdAt: data.created_at
    }
  },

  async deleteExpense(id: number): Promise<void> {
    const { error } = await supabase
      .from('monthly_expenses')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  async getExpensesByMonth(year: number, month: number): Promise<MonthlyExpense[]> {
    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`
    const endDate = `${year}-${month.toString().padStart(2, '0')}-31`
    
    const { data, error } = await supabase
      .from('monthly_expenses')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false })
    
    if (error) throw error
    
    return data.map(expense => ({
      id: expense.id,
      name: expense.name,
      amount: expense.amount,
      date: expense.date,
      description: expense.description,
      isRecurring: expense.is_recurring,
      createdAt: expense.created_at
    }))
  },

  async getTotalExpensesByMonth(year: number, month: number): Promise<number> {
    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`
    const endDate = `${year}-${month.toString().padStart(2, '0')}-31`
    
    const { data, error } = await supabase
      .from('monthly_expenses')
      .select('amount')
      .gte('date', startDate)
      .lte('date', endDate)
    
    if (error) throw error
    
    return data.reduce((sum, expense) => sum + expense.amount, 0)
  },

  // Dashboard Analytics
  async getDashboardStats(startDate: string, endDate: string): Promise<DashboardStats> {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .gte('start_date', startDate)
      .lte('end_date', endDate)
    
    if (error) throw error

    const bookings = data || []
    
    const stats: DashboardStats = {
      totalRevenue: bookings.reduce((sum, b) => sum + (b.total_amount || 0), 0),
      myIncome: bookings.reduce((sum, b) => sum + (b.my_income || 0), 0),
      ownerIncome: bookings.reduce((sum, b) => sum + (b.owner_amount || 0), 0),
      totalBookings: bookings.length,
      activeBookings: bookings.filter(b => b.status === 'active').length,
      completedBookings: bookings.filter(b => b.status === 'completed').length,
      totalRentalDays: bookings.reduce((sum, b) => sum + (b.rental_days || 0), 0),
      averageBookingValue: bookings.length > 0 
        ? bookings.reduce((sum, b) => sum + (b.total_amount || 0), 0) / bookings.length 
        : 0
    }

    return stats
  },

  async getCarPerformance(startDate: string, endDate: string): Promise<CarPerformance[]> {
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('*')
      .gte('start_date', startDate)
      .lte('end_date', endDate)
    
    if (bookingsError) throw bookingsError

    // Get cars data to map car names
    const { data: cars, error: carsError } = await supabase
      .from('cars')
      .select('id, brand, model')
    
    if (carsError) throw carsError

    const carsMap = new Map<number, {brand: string, model: string}>()
    cars?.forEach(car => {
      carsMap.set(car.id, { brand: car.brand, model: car.model })
    })

    const bookingsData = bookings || []
    
    // Group by car
    const carMap = new Map<number, CarPerformance>()
    
    bookingsData.forEach(booking => {
      const carId = booking.car_id
      const carInfo = carsMap.get(carId)
      const carName = carInfo ? `${carInfo.brand} ${carInfo.model}` : 'Unknown Car'
      
      if (!carMap.has(carId)) {
        carMap.set(carId, {
          carId,
          carName,
          totalDays: 0,
          bookingCount: 0,
          totalRevenue: 0,
          myIncome: 0,
          ownerIncome: 0,
          averageDailyRate: 0
        })
      }
      
      const carPerf = carMap.get(carId)!
      carPerf.totalDays += booking.rental_days || 0
      carPerf.bookingCount += 1
      carPerf.totalRevenue += booking.total_amount || 0
      carPerf.myIncome += booking.my_income || 0
      carPerf.ownerIncome += booking.owner_amount || 0
    })
    
    // Calculate averages
    const performances = Array.from(carMap.values())
    performances.forEach(perf => {
      perf.averageDailyRate = perf.totalDays > 0 ? perf.totalRevenue / perf.totalDays : 0
    })
    
    // Sort by revenue
    return performances.sort((a, b) => b.totalRevenue - a.totalRevenue)
  },

  async getMonthlyRevenue(year: number): Promise<PeriodRevenue[]> {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .gte('start_date', `${year}-01-01`)
      .lte('end_date', `${year}-12-31`)
    
    if (error) throw error

    const bookings = data || []
    
    // Group by month
    const monthMap = new Map<string, PeriodRevenue>()
    
    bookings.forEach(booking => {
      const month = booking.start_date.substring(0, 7) // YYYY-MM
      if (!monthMap.has(month)) {
        monthMap.set(month, {
          period: month,
          totalRevenue: 0,
          myIncome: 0,
          ownerIncome: 0,
          bookingCount: 0
        })
      }
      
      const monthData = monthMap.get(month)!
      monthData.totalRevenue += booking.total_amount || 0
      monthData.myIncome += booking.my_income || 0
      monthData.ownerIncome += booking.owner_amount || 0
      monthData.bookingCount += 1
    })
    
    return Array.from(monthMap.values()).sort((a, b) => a.period.localeCompare(b.period))
  },

  async getDailyRevenue(startDate: string, endDate: string): Promise<PeriodRevenue[]> {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .gte('start_date', startDate)
      .lte('end_date', endDate)
    
    if (error) throw error

    const bookings = data || []
    
    // Group by day
    const dayMap = new Map<string, PeriodRevenue>()
    
    bookings.forEach(booking => {
      const day = booking.start_date.substring(0, 10) // YYYY-MM-DD
      if (!dayMap.has(day)) {
        dayMap.set(day, {
          period: day,
          totalRevenue: 0,
          myIncome: 0,
          ownerIncome: 0,
          bookingCount: 0
        })
      }
      
      const dayData = dayMap.get(day)!
      dayData.totalRevenue += booking.total_amount || 0
      dayData.myIncome += booking.my_income || 0
      dayData.ownerIncome += booking.owner_amount || 0
      dayData.bookingCount += 1
    })
    
    return Array.from(dayMap.values()).sort((a, b) => a.period.localeCompare(b.period))
  }
}