// Test Supabase connection - run with: node test-supabase-connection.js

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Read .env.local file directly
let supabaseUrl = null;
let supabaseAnonKey = null;

try {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    const lines = envContent.split('\n');

    for (const line of lines) {
        if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
            supabaseUrl = line.split('=')[1].trim();
        }
        if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
            supabaseAnonKey = line.split('=')[1].trim();
        }
    }
} catch (error) {
    console.error('Error reading .env.local:', error.message);
}

console.log('🔧 Testing Supabase connection...');
console.log('URL:', supabaseUrl ? 'set' : 'missing');
console.log('Key:', supabaseAnonKey ? 'set (length: ' + supabaseAnonKey.length + ')' : 'missing');

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Environment variables not set');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
    try {
        console.log('📡 Testing basic connection...');

        // Test 1: Get server version (should work without auth)
        const { data, error } = await supabase
            .from('profiles')
            .select('id')
            .limit(1);

        console.log('✅ Connection test result:', {
            success: !error,
            error: error?.message,
            dataLength: data?.length
        });

        // Test 2: Try signup (will fail but should give us error details)
        console.log('📡 Testing signup endpoint...');
        const testEmail = `test-${Date.now()}@example.com`;
        const testPassword = 'testpassword123';

        const { data: signupData, error: signupError } = await supabase.auth.signUp({
            email: testEmail,
            password: testPassword,
            options: {
                data: {
                    first_name: 'Test',
                    last_name: 'User',
                    locale: 'en',
                    currency: 'MAD'
                }
            }
        });

        console.log('✅ Signup test result:', {
            success: !signupError,
            hasUser: !!signupData?.user,
            error: signupError?.message,
            userId: signupData?.user?.id
        });

    } catch (error) {
        console.error('❌ Connection test failed:', error);
    }
}

testConnection();
