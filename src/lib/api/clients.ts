import { supabase } from '@/lib/supabase'
import { Client } from '@/types'

export const clientsApi = {
  async getAll(): Promise<Client[]> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    return data.map(client => ({
      id: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone,
      totalBookings: client.total_bookings,
      totalSpent: client.total_spent,
      status: client.status,
      joinDate: client.join_date,
      lastBooking: client.last_booking,
      avatar: client.avatar,
      createdAt: client.created_at,
      updatedAt: client.updated_at
    }))
  },

  async getById(id: string): Promise<Client | null> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) return null
    
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      totalBookings: data.total_bookings,
      totalSpent: data.total_spent,
      status: data.status,
      joinDate: data.join_date,
      lastBooking: data.last_booking,
      avatar: data.avatar,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    }
  },

  async create(client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .insert({
        name: client.name,
        email: client.email,
        phone: client.phone,
        total_bookings: client.totalBookings,
        total_spent: client.totalSpent,
        status: client.status,
        join_date: client.joinDate,
        last_booking: client.lastBooking,
        avatar: client.avatar
      })
      .select()
      .single()
    
    if (error) throw error
    
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      totalBookings: data.total_bookings,
      totalSpent: data.total_spent,
      status: data.status,
      joinDate: data.join_date,
      lastBooking: data.last_booking,
      avatar: data.avatar,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    }
  },

  async update(id: string, client: Partial<Client>): Promise<Client> {
    const updateData: any = {}
    
    if (client.name !== undefined) updateData.name = client.name
    if (client.email !== undefined) updateData.email = client.email
    if (client.phone !== undefined) updateData.phone = client.phone
    if (client.totalBookings !== undefined) updateData.total_bookings = client.totalBookings
    if (client.totalSpent !== undefined) updateData.total_spent = client.totalSpent
    if (client.status !== undefined) updateData.status = client.status
    if (client.joinDate !== undefined) updateData.join_date = client.joinDate
    if (client.lastBooking !== undefined) updateData.last_booking = client.lastBooking
    if (client.avatar !== undefined) updateData.avatar = client.avatar
    
    const { data, error } = await supabase
      .from('clients')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      totalBookings: data.total_bookings,
      totalSpent: data.total_spent,
      status: data.status,
      joinDate: data.join_date,
      lastBooking: data.last_booking,
      avatar: data.avatar,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    }
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}
