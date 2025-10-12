import { supabase } from '@/lib/supabase'
import { Car } from '@/types'

export const carsApi = {
  async getAll(): Promise<Car[]> {
    // Check auth
    const { data: { session } } = await supabase.auth.getSession()
    console.log('Current session:', session ? 'Logged in' : 'Not logged in', session?.user?.email)
    
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Supabase cars error:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      throw error
    }
    
    console.log('Cars data from Supabase:', data ? `${data.length} cars found` : 'No data')
    
    if (!data) return []
    
    return data.map(car => ({
      id: car.id,
      brand: car.brand,
      model: car.model,
      year: car.year,
      color: car.color,
      plateNumber: car.plate_number,
      dailyRate: car.daily_rate,
      ownerRate: car.owner_rate,
      insurancePrice: car.insurance_price,
      isAvailable: car.is_available,
      description: car.description,
      imageUrl: car.image_url,
      createdAt: car.created_at,
      updatedAt: car.updated_at
    }))
  },

  async getById(id: string | number): Promise<Car | null> {
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) return null
    
    return {
      id: data.id,
      brand: data.brand,
      model: data.model,
      year: data.year,
      color: data.color,
      plateNumber: data.plate_number,
      dailyRate: data.daily_rate,
      ownerRate: data.owner_rate,
      insurancePrice: data.insurance_price,
      isAvailable: data.is_available,
      description: data.description,
      imageUrl: data.image_url,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    }
  },

  async create(car: Omit<Car, 'id' | 'createdAt' | 'updatedAt'>): Promise<Car> {
    const { data, error } = await supabase
      .from('cars')
      .insert({
        brand: car.brand,
        model: car.model,
        year: car.year,
        color: car.color,
        plate_number: car.plateNumber,
        daily_rate: car.dailyRate,
        owner_rate: car.ownerRate,
        insurance_price: car.insurancePrice,
        is_available: car.isAvailable,
        description: car.description,
        image_url: car.imageUrl
      })
      .select()
      .single()
    
    if (error) throw error
    
    return {
      id: data.id,
      brand: data.brand,
      model: data.model,
      year: data.year,
      color: data.color,
      plateNumber: data.plate_number,
      dailyRate: data.daily_rate,
      ownerRate: data.owner_rate,
      insurancePrice: data.insurance_price,
      isAvailable: data.is_available,
      description: data.description,
      imageUrl: data.image_url,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    }
  },

  async update(id: number, car: Partial<Car>): Promise<Car> {
    const updateData: any = {}
    
    if (car.brand !== undefined) updateData.brand = car.brand
    if (car.model !== undefined) updateData.model = car.model
    if (car.year !== undefined) updateData.year = car.year
    if (car.color !== undefined) updateData.color = car.color
    if (car.plateNumber !== undefined) updateData.plate_number = car.plateNumber
    if (car.dailyRate !== undefined) updateData.daily_rate = car.dailyRate
    if (car.ownerRate !== undefined) updateData.owner_rate = car.ownerRate
    if (car.insurancePrice !== undefined) updateData.insurance_price = car.insurancePrice
    if (car.isAvailable !== undefined) updateData.is_available = car.isAvailable
    if (car.description !== undefined) updateData.description = car.description
    if (car.imageUrl !== undefined) updateData.image_url = car.imageUrl
    
    const { data, error } = await supabase
      .from('cars')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    
    return {
      id: data.id,
      brand: data.brand,
      model: data.model,
      year: data.year,
      color: data.color,
      plateNumber: data.plate_number,
      dailyRate: data.daily_rate,
      ownerRate: data.owner_rate,
      insurancePrice: data.insurance_price,
      isAvailable: data.is_available,
      description: data.description,
      imageUrl: data.image_url,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    }
  },

  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('cars')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}