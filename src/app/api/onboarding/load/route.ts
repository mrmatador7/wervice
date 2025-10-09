import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
        },
      }
    );

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Get onboarding data
    let { data: profile, error } = await supabase
      .from('profiles')
      .select('onboarding_data, onboarded')
      .eq('id', userId)
      .single();

    // If profile doesn't exist, create it
    if (error && error.code === 'PGRST116') {
      console.log('Profile not found, creating new profile for user:', userId);
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          onboarded: false,
          onboarding_data: {}
        })
        .select('onboarding_data, onboarded')
        .single();

      if (createError) {
        console.error('Error creating profile:', createError);
        return NextResponse.json({ error: 'Failed to create profile' }, { status: 500 });
      }

      profile = newProfile;
    } else if (error) {
      console.error('Error fetching onboarding data:', error);
      return NextResponse.json({ error: 'Failed to fetch onboarding data' }, { status: 500 });
    }

    return NextResponse.json({
      onboardingData: profile?.onboarding_data || {},
      onboarded: profile?.onboarded || false
    });

  } catch (error) {
    console.error('Unexpected error in onboarding load:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
