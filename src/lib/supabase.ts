import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🔧 Supabase client initialized:', {
    url: supabaseUrl ? 'set' : 'missing',
    key: supabaseAnonKey ? 'set (length: ' + supabaseAnonKey.length + ')' : 'missing',
    environment: process.env.NODE_ENV
})

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Supabase environment variables not set. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.')
    throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
