import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

console.log('🔧 Supabase client initialized:', {
    url: supabaseUrl ? 'set' : 'missing',
    key: supabaseAnonKey ? 'set (length: ' + supabaseAnonKey.length + ')' : 'missing',
    environment: process.env.NODE_ENV
})

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
