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
    // For now, just return default settings to avoid database errors
    // TODO: Implement settings table in Supabase if needed
    console.log('Using default settings (settings table not configured)');
    return defaultSettings;
  },

  async update(settings: Partial<Settings>): Promise<Settings> {
    // For now, just return the updated settings without saving to database
    // TODO: Implement settings table in Supabase if needed
    console.log('Settings update requested but not saved to database:', settings);
    return { ...defaultSettings, ...settings };
  }
}
