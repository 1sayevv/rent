import { supabase } from '@/lib/supabase'
import { Booking } from '@/types'

export const bookingsApi = {
  async getAll(): Promise<Booking[]> {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    return data.map(booking => ({
      id: booking.id,
      customerName: booking.customer_name,
      customerCountry: booking.customer_country,
      customerPhone: booking.customer_phone,
      carId: booking.car_id,
      carName: booking.car_name,
      startDate: booking.start_date,
      endDate: booking.end_date,
      rentalDays: booking.rental_days,
      deliveryToAirport: booking.delivery_to_airport,
      deliveryToHotel: booking.delivery_to_hotel,
      deliveryLocation: booking.delivery_location,
      fullInsurance: booking.full_insurance,
      totalAmount: booking.total_amount,
      dailyRate: booking.daily_rate,
      ownerAmount: booking.owner_amount,
      myIncome: booking.my_income,
      pickupLocation: booking.pickup_location,
      returnLocation: booking.return_location,
      notes: booking.notes,
      status: booking.status,
      createdAt: booking.created_at,
      updatedAt: booking.updated_at
    }))
  },

  async create(booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<Booking> {
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        customer_name: booking.customerName,
        customer_country: booking.customerCountry,
        customer_phone: booking.customerPhone,
        car_id: booking.carId,
        car_name: booking.carName,
        start_date: booking.startDate,
        end_date: booking.endDate,
        rental_days: booking.rentalDays,
        delivery_to_airport: booking.deliveryToAirport,
        delivery_to_hotel: booking.deliveryToHotel,
        delivery_location: booking.deliveryLocation,
        full_insurance: booking.fullInsurance,
        total_amount: booking.totalAmount,
        daily_rate: booking.dailyRate,
        owner_amount: booking.ownerAmount,
        my_income: booking.myIncome,
        pickup_location: booking.pickupLocation,
        return_location: booking.returnLocation,
        notes: booking.notes,
        status: booking.status
      })
      .select()
      .single()
    
    if (error) throw error
    
    return {
      id: data.id,
      customerName: data.customer_name,
      customerCountry: data.customer_country,
      customerPhone: data.customer_phone,
      carId: data.car_id,
      carName: data.car_name,
      startDate: data.start_date,
      endDate: data.end_date,
      rentalDays: data.rental_days,
      deliveryToAirport: data.delivery_to_airport,
      deliveryToHotel: data.delivery_to_hotel,
      deliveryLocation: data.delivery_location,
      fullInsurance: data.full_insurance,
      totalAmount: data.total_amount,
      dailyRate: data.daily_rate,
      ownerAmount: data.owner_amount,
      myIncome: data.my_income,
      pickupLocation: data.pickup_location,
      returnLocation: data.return_location,
      notes: data.notes,
      status: data.status,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    }
  },

  async update(id: number, booking: Partial<Booking>): Promise<Booking> {
    const updateData: any = {}
    
    if (booking.customerName !== undefined) updateData.customer_name = booking.customerName
    if (booking.customerCountry !== undefined) updateData.customer_country = booking.customerCountry
    if (booking.customerPhone !== undefined) updateData.customer_phone = booking.customerPhone
    if (booking.carId !== undefined) updateData.car_id = booking.carId
    if (booking.carName !== undefined) updateData.car_name = booking.carName
    if (booking.startDate !== undefined) updateData.start_date = booking.startDate
    if (booking.endDate !== undefined) updateData.end_date = booking.endDate
    if (booking.rentalDays !== undefined) updateData.rental_days = booking.rentalDays
    if (booking.deliveryToAirport !== undefined) updateData.delivery_to_airport = booking.deliveryToAirport
    if (booking.deliveryToHotel !== undefined) updateData.delivery_to_hotel = booking.deliveryToHotel
    if (booking.deliveryLocation !== undefined) updateData.delivery_location = booking.deliveryLocation
    if (booking.fullInsurance !== undefined) updateData.full_insurance = booking.fullInsurance
    if (booking.totalAmount !== undefined) updateData.total_amount = booking.totalAmount
    if (booking.dailyRate !== undefined) updateData.daily_rate = booking.dailyRate
    if (booking.ownerAmount !== undefined) updateData.owner_amount = booking.ownerAmount
    if (booking.myIncome !== undefined) updateData.my_income = booking.myIncome
    if (booking.pickupLocation !== undefined) updateData.pickup_location = booking.pickupLocation
    if (booking.returnLocation !== undefined) updateData.return_location = booking.returnLocation
    if (booking.notes !== undefined) updateData.notes = booking.notes
    if (booking.status !== undefined) updateData.status = booking.status
    
    const { data, error } = await supabase
      .from('bookings')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    
    return {
      id: data.id,
      customerName: data.customer_name,
      customerCountry: data.customer_country,
      customerPhone: data.customer_phone,
      carId: data.car_id,
      carName: data.car_name,
      startDate: data.start_date,
      endDate: data.end_date,
      rentalDays: data.rental_days,
      deliveryToAirport: data.delivery_to_airport,
      deliveryToHotel: data.delivery_to_hotel,
      deliveryLocation: data.delivery_location,
      fullInsurance: data.full_insurance,
      totalAmount: data.total_amount,
      dailyRate: data.daily_rate,
      ownerAmount: data.owner_amount,
      myIncome: data.my_income,
      pickupLocation: data.pickup_location,
      returnLocation: data.return_location,
      notes: data.notes,
      status: data.status,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    }
  },

  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}
