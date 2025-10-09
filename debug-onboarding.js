// Debug script for onboarding - run in browser console on onboarding page
// This will help test the database operations directly

async function testOnboardingSetup() {
  console.log('🔍 Testing onboarding setup...');

  try {
    // Test 1: Check if we can access profiles table
    console.log('📋 Test 1: Profile table access');
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id, onboarded')
      .limit(1);

    console.log('Profile access result:', {
      success: !profileError,
      data: profileData,
      error: profileError
    });

    // Test 2: Check if RPC function exists
    console.log('📋 Test 2: RPC function test');
    const { data: rpcData, error: rpcError } = await supabase.rpc('upsert_user_profile', {
      p_user_id: '00000000-0000-0000-0000-000000000000', // dummy UUID
      p_phone: 'test',
      p_city: 'test',
      p_onboarding_purpose: 'test',
      p_onboarding_data: { test: true }
    });

    console.log('RPC function result:', {
      success: !rpcError,
      data: rpcData,
      error: rpcError
    });

    // Test 3: Check current user authentication
    console.log('📋 Test 3: Authentication check');
    const { data: authData, error: authError } = await supabase.auth.getUser();

    console.log('Auth check result:', {
      authenticated: !!authData.user,
      userId: authData.user?.id,
      email: authData.user?.email,
      error: authError
    });

  } catch (error) {
    console.error('❌ Debug test failed:', error);
  }
}

// Run the test
testOnboardingSetup();
