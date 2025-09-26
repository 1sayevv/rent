import { supabase } from '@/lib/supabase'
import { FinancialRecord } from '@/types'

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
  }
}
