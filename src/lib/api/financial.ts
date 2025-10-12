import { supabase } from '@/lib/supabase'
import { FinancialRecord, Booking } from '@/types'

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
  async getAll(): Promise<FinancialRecord[]> {
    const { data, error } = await supabase
      .from('financial_records')
      .select('*')
      .order('date', { ascending: false })
    
    if (error) throw error
    
    return data.map(record => ({
      id: record.id,
      type: record.type,
      category: record.category,
      amount: record.amount,
      description: record.description,
      date: record.date,
      createdAt: record.created_at
    }))
  },

  async create(record: Omit<FinancialRecord, 'id' | 'createdAt'>): Promise<FinancialRecord> {
    const { data, error } = await supabase
      .from('financial_records')
      .insert({
        type: record.type,
        category: record.category,
        amount: record.amount,
        description: record.description,
        date: record.date
      })
      .select()
      .single()
    
    if (error) throw error
    
    return {
      id: data.id,
      type: data.type,
      category: data.category,
      amount: data.amount,
      description: data.description,
      date: data.date,
      createdAt: data.created_at
    }
  },

  async update(id: number, record: Partial<FinancialRecord>): Promise<FinancialRecord> {
    const updateData: any = {}
    
    if (record.type !== undefined) updateData.type = record.type
    if (record.category !== undefined) updateData.category = record.category
    if (record.amount !== undefined) updateData.amount = record.amount
    if (record.description !== undefined) updateData.description = record.description
    if (record.date !== undefined) updateData.date = record.date
    
    const { data, error } = await supabase
      .from('financial_records')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    
    return {
      id: data.id,
      type: data.type,
      category: data.category,
      amount: data.amount,
      description: data.description,
      date: data.date,
      createdAt: data.created_at
    }
  },

  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('financial_records')
      .delete()
      .eq('id', id)
    
    if (error) throw error
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
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .gte('start_date', startDate)
      .lte('end_date', endDate)
    
    if (error) throw error

    const bookings = data || []
    
    // Group by car
    const carMap = new Map<number, CarPerformance>()
    
    bookings.forEach(booking => {
      const carId = booking.car_id
      if (!carMap.has(carId)) {
        carMap.set(carId, {
          carId,
          carName: booking.car_name,
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

