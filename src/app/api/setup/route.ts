import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    // Test if we can access the vendors table by trying a simple query
    const { data: testData, error: testError } = await supabase
      .from('vendors')
      .select('count', { count: 'exact', head: true });

    if (testError) {
      return NextResponse.json({
        error: 'Vendors table does not exist or is not accessible',
        details: testError.message,
        suggestion: 'Please run the migration: supabase db push or apply the SQL from supabase/migrations/20251017000002_create_public_vendors_table.sql'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Vendors table exists and is accessible',
      recordCount: testData
    });
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json(
      { error: 'Setup failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
