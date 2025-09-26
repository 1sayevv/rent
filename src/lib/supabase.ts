import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://iwoawfbkagodxazdedzx.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3b2F3ZmJrYWdvZHhhemRlZHp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1ODg1NDEsImV4cCI6MjA3MzE2NDU0MX0.C-M9U-SVh2eaSR_2cgeYmD7yKFKJcGriZt42v06x2nY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
