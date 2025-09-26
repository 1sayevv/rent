import { supabase } from '@/lib/supabase'
import { Car } from '@/types'

export const carsApi = {
  async getAll(): Promise<Car[]> {
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    return data.map(car => ({
      id: car.id,
      name: car.name,
      model: car.model,
      year: car.year,
      category: car.category,
      pricePerDay: car.price_per_day,
      weeklyPrice: car.weekly_price,
      monthlyPrice: car.monthly_price,
      mileage: car.mileage,
      fuelType: car.fuel_type,
      transmission: car.transmission,
      seats: car.seats,
      status: car.status,
      description: car.description,
      image: car.image,
      images: car.images,
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
      name: data.name,
      model: data.model,
      year: data.year,
      category: data.category,
      pricePerDay: data.price_per_day,
      weeklyPrice: data.weekly_price,
      monthlyPrice: data.monthly_price,
      mileage: data.mileage,
      fuelType: data.fuel_type,
      transmission: data.transmission,
      seats: data.seats,
      status: data.status,
      description: data.description,
      image: data.image,
      images: data.images,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    }
  },

  async create(car: Omit<Car, 'id' | 'createdAt' | 'updatedAt'>): Promise<Car> {
    const { data, error } = await supabase
      .from('cars')
      .insert({
        name: car.name,
        model: car.model,
        year: car.year,
        category: car.category,
        price_per_day: car.pricePerDay,
        weekly_price: car.weeklyPrice,
        monthly_price: car.monthlyPrice,
        mileage: car.mileage,
        fuel_type: car.fuelType,
        transmission: car.transmission,
        seats: car.seats,
        status: car.status,
        description: car.description,
        image: car.image,
        images: car.images
      })
      .select()
      .single()
    
    if (error) throw error
    
    return {
      id: data.id,
      name: data.name,
      model: data.model,
      year: data.year,
      category: data.category,
      pricePerDay: data.price_per_day,
      weeklyPrice: data.weekly_price,
      monthlyPrice: data.monthly_price,
      mileage: data.mileage,
      fuelType: data.fuel_type,
      transmission: data.transmission,
      seats: data.seats,
      status: data.status,
      description: data.description,
      image: data.image,
      images: data.images,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    }
  },

  async update(id: number, car: Partial<Car>): Promise<Car> {
    const updateData: any = {}
    
    if (car.name !== undefined) updateData.name = car.name
    if (car.model !== undefined) updateData.model = car.model
    if (car.year !== undefined) updateData.year = car.year
    if (car.category !== undefined) updateData.category = car.category
    if (car.pricePerDay !== undefined) updateData.price_per_day = car.pricePerDay
    if (car.weeklyPrice !== undefined) updateData.weekly_price = car.weeklyPrice
    if (car.monthlyPrice !== undefined) updateData.monthly_price = car.monthlyPrice
    if (car.mileage !== undefined) updateData.mileage = car.mileage
    if (car.fuelType !== undefined) updateData.fuel_type = car.fuelType
    if (car.transmission !== undefined) updateData.transmission = car.transmission
    if (car.seats !== undefined) updateData.seats = car.seats
    if (car.status !== undefined) updateData.status = car.status
    if (car.description !== undefined) updateData.description = car.description
    if (car.image !== undefined) updateData.image = car.image
    if (car.images !== undefined) updateData.images = car.images
    
    const { data, error } = await supabase
      .from('cars')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    
    return {
      id: data.id,
      name: data.name,
      model: data.model,
      year: data.year,
      category: data.category,
      pricePerDay: data.price_per_day,
      weeklyPrice: data.weekly_price,
      monthlyPrice: data.monthly_price,
      mileage: data.mileage,
      fuelType: data.fuel_type,
      transmission: data.transmission,
      seats: data.seats,
      status: data.status,
      description: data.description,
      image: data.image,
      images: data.images,
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
