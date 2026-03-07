import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const { newEmail, currentPassword } = await request.json();
    if (!newEmail || !currentPassword) {
      return NextResponse.json({ error: 'New email and current password are required' }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });
    if (verifyError) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 });
    }

    const { data, error } = await supabase.auth.updateUser({ email: newEmail });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      user: data.user,
      message: 'Email update requested. Please confirm from your inbox if required.',
    });
  } catch (error) {
    console.error('Unexpected error in change-email:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
