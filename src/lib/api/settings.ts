import { supabase } from '@/lib/supabase'
import { Settings } from '@/types'

const defaultSettings: Settings = {
  companyName: "Auto Manage Suite",
  companyEmail: "info@automanage.az",
  companyPhone: "+994 12 345 67 89",
  companyAddress: "Baku, Azerbaijan",
  currency: "₼",
  timezone: "Asia/Baku",
  language: "ru",
  notifications: {
    email: true,
    sms: false,
    push: true
  }
}

export const settingsApi = {
  async get(): Promise<Settings> {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('id', 1)
        .single()
      
      if (error) {
        console.warn('Settings table not found, using default settings:', error.message);
        return defaultSettings;
      }
      
      return {
        companyName: data.company_name,
        companyEmail: data.company_email,
        companyPhone: data.company_phone,
        companyAddress: data.company_address,
        currency: data.currency,
        timezone: data.timezone,
        language: data.language,
        notifications: data.notifications
      }
    } catch (error) {
      console.warn('Error fetching settings, using default:', error);
      return defaultSettings;
    }
  },

  async update(settings: Partial<Settings>): Promise<Settings> {
    const updateData: any = {}
    
    if (settings.companyName !== undefined) updateData.company_name = settings.companyName
    if (settings.companyEmail !== undefined) updateData.company_email = settings.companyEmail
    if (settings.companyPhone !== undefined) updateData.company_phone = settings.companyPhone
    if (settings.companyAddress !== undefined) updateData.company_address = settings.companyAddress
    if (settings.currency !== undefined) updateData.currency = settings.currency
    if (settings.timezone !== undefined) updateData.timezone = settings.timezone
    if (settings.language !== undefined) updateData.language = settings.language
    if (settings.notifications !== undefined) updateData.notifications = settings.notifications
    
    const { data, error } = await supabase
      .from('settings')
      .update(updateData)
      .eq('id', 1)
      .select()
      .single()
    
    if (error) throw error
    
    return {
      companyName: data.company_name,
      companyEmail: data.company_email,
      companyPhone: data.company_phone,
      companyAddress: data.company_address,
      currency: data.currency,
      timezone: data.timezone,
      language: data.language,
      notifications: data.notifications
    }
  }
}
