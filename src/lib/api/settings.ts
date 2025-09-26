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
    try {
      // First try to get settings
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('id', 1)
        .single()
      
      if (error) {
        console.warn('Settings not found, using default settings:', error.message);
        // Try to create default settings
        await this.createDefaultSettings();
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

  async createDefaultSettings(): Promise<void> {
    try {
      const { error } = await supabase
        .from('settings')
        .insert({
          id: 1,
          company_name: defaultSettings.companyName,
          company_email: defaultSettings.companyEmail,
          company_phone: defaultSettings.companyPhone,
          company_address: defaultSettings.companyAddress,
          currency: defaultSettings.currency,
          timezone: defaultSettings.timezone,
          language: defaultSettings.language,
          notifications: defaultSettings.notifications
        })
      
      if (error) {
        console.warn('Could not create default settings:', error.message);
      }
    } catch (error) {
      console.warn('Error creating default settings:', error);
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
    
    try {
      const { data, error } = await supabase
        .from('settings')
        .update(updateData)
        .eq('id', 1)
        .select()
        .single()
      
      if (error) {
        // If update fails, try to insert
        const { data: insertData, error: insertError } = await supabase
          .from('settings')
          .insert({
            id: 1,
            ...updateData
          })
          .select()
          .single()
        
        if (insertError) throw insertError
        
        return this.mapSettingsData(insertData);
      }
      
      return this.mapSettingsData(data);
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  },

  mapSettingsData(data: any): Settings {
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
