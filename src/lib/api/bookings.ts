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
      clientId: booking.client_id,
      client: {
        name: 'Client Name',
        phone: 'Phone',
        email: 'Email'
      },
      carId: booking.car_id,
      car: 'Car Name',
      startDate: booking.start_date,
      endDate: booking.end_date,
      pickupLocation: booking.pickup_location,
      returnLocation: booking.return_location,
      totalPrice: booking.total_price,
      status: booking.status,
      createdAt: booking.created_at,
      updatedAt: booking.updated_at
    }))
  },

  async create(booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<Booking> {
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        client_id: booking.clientId,
        car_id: booking.carId,
        start_date: booking.startDate,
        end_date: booking.endDate,
        pickup_location: booking.pickupLocation,
        return_location: booking.returnLocation,
        total_price: booking.totalPrice,
        status: booking.status
      })
      .select()
      .single()
    
    if (error) throw error
    
    return {
      id: data.id,
      clientId: data.client_id,
      client: {
        name: 'Client Name',
        phone: 'Phone',
        email: 'Email'
      },
      carId: data.car_id,
      car: 'Car Name',
      startDate: data.start_date,
      endDate: data.end_date,
      pickupLocation: data.pickup_location,
      returnLocation: data.return_location,
      totalPrice: data.total_price,
      status: data.status,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    }
  },

  async update(id: number, booking: Partial<Booking>): Promise<Booking> {
    const updateData: any = {}
    
    if (booking.clientId !== undefined) updateData.client_id = booking.clientId
    if (booking.carId !== undefined) updateData.car_id = booking.carId
    if (booking.startDate !== undefined) updateData.start_date = booking.startDate
    if (booking.endDate !== undefined) updateData.end_date = booking.endDate
    if (booking.pickupLocation !== undefined) updateData.pickup_location = booking.pickupLocation
    if (booking.returnLocation !== undefined) updateData.return_location = booking.returnLocation
    if (booking.totalPrice !== undefined) updateData.total_price = booking.totalPrice
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
      clientId: data.client_id,
      client: {
        name: 'Client Name',
        phone: 'Phone',
        email: 'Email'
      },
      carId: data.car_id,
      car: 'Car Name',
      startDate: data.start_date,
      endDate: data.end_date,
      pickupLocation: data.pickup_location,
      returnLocation: data.return_location,
      totalPrice: data.total_price,
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
