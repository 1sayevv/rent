import { supabase } from '@/lib/supabase'
import { Settings } from '@/types'

const defaultSettings: Settings = {
  companyName: "Auto Manage Suite",
  companyEmail: "info@automanage.az",
  companyPhone: "+994 12 345 67 89",
  companyAddress: "Baku, Azerbaijan",
  currency: "₼",
  timezone: "Asia/Baku",
  language: "en",
  notifications: {
    email: true,
    sms: false,
    push: true
  }
}

export const settingsApi = {
  async get(): Promise<Settings> {
<<<<<<< HEAD
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('id', 1)
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
=======
    // For now, just return default settings to avoid database errors
    // TODO: Implement settings table in Supabase if needed
    console.log('Using default settings (settings table not configured)');
    return defaultSettings;
>>>>>>> 48d795e0adec41c2ce40d0d904987dab7adb8a3d
  },

  async update(settings: Partial<Settings>): Promise<Settings> {
    // For now, just return the updated settings without saving to database
    // TODO: Implement settings table in Supabase if needed
    console.log('Settings update requested but not saved to database:', settings);
    return { ...defaultSettings, ...settings };
  }
}

