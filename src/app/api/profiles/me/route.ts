import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabase = await createClient();

    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch the user's profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // If no profile exists, return 404
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const onboardingData =
      profile.onboarding_data && typeof profile.onboarding_data === 'object'
        ? (profile.onboarding_data as Record<string, unknown>)
        : {};
    const notifications =
      profile.notification_preferences && typeof profile.notification_preferences === 'object'
        ? (profile.notification_preferences as Record<string, unknown>)
        : {};

    return NextResponse.json({
      user: {
        ...profile,
        language: profile.locale,
        wedding_date: (onboardingData.wedding_date as string) || (onboardingData.eventDate as string) || null,
        guest_count: onboardingData.guest_count ?? onboardingData.guestCount ?? null,
        budget: onboardingData.budget ?? null,
        email_notifications:
          typeof notifications.email_notifications === 'boolean'
            ? notifications.email_notifications
            : typeof notifications.email === 'boolean'
              ? notifications.email
              : true,
        whatsapp_notifications:
          typeof notifications.whatsapp_notifications === 'boolean'
            ? notifications.whatsapp_notifications
            : typeof notifications.whatsapp === 'boolean'
              ? notifications.whatsapp
              : false,
      },
    });
  } catch (error: any) {
    console.error('API Error in /api/profiles/me:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error?.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await request.json();
    const {
      data: currentProfile,
      error: currentProfileError,
    } = await supabase
      .from('profiles')
      .select('onboarding_data, notification_preferences')
      .eq('id', user.id)
      .maybeSingle();

    if (currentProfileError) {
      return NextResponse.json({ error: currentProfileError.message }, { status: 400 });
    }

    const currentOnboarding =
      currentProfile?.onboarding_data && typeof currentProfile.onboarding_data === 'object'
        ? (currentProfile.onboarding_data as Record<string, unknown>)
        : {};
    const currentNotifications =
      currentProfile?.notification_preferences && typeof currentProfile.notification_preferences === 'object'
        ? (currentProfile.notification_preferences as Record<string, unknown>)
        : {};

    const updates: Record<string, unknown> = {};
    const dbAllowedFields = ['first_name', 'last_name', 'phone', 'city', 'currency'] as const;
    for (const key of dbAllowedFields) {
      if (Object.prototype.hasOwnProperty.call(payload, key)) {
        updates[key] = payload[key];
      }
    }

    if (Object.prototype.hasOwnProperty.call(payload, 'language')) {
      updates.locale = payload.language;
    }

    const onboardingData = {
      ...currentOnboarding,
      ...(Object.prototype.hasOwnProperty.call(payload, 'wedding_date')
        ? { wedding_date: payload.wedding_date ?? null }
        : {}),
      ...(Object.prototype.hasOwnProperty.call(payload, 'guest_count')
        ? { guest_count: payload.guest_count ?? null }
        : {}),
      ...(Object.prototype.hasOwnProperty.call(payload, 'budget')
        ? { budget: payload.budget ?? null }
        : {}),
    };
    updates.onboarding_data = onboardingData;

    const notificationPreferences = {
      ...currentNotifications,
      ...(Object.prototype.hasOwnProperty.call(payload, 'email_notifications')
        ? {
            email_notifications: Boolean(payload.email_notifications),
            email: Boolean(payload.email_notifications),
          }
        : {}),
      ...(Object.prototype.hasOwnProperty.call(payload, 'whatsapp_notifications')
        ? {
            whatsapp_notifications: Boolean(payload.whatsapp_notifications),
            whatsapp: Boolean(payload.whatsapp_notifications),
          }
        : {}),
    };
    updates.notification_preferences = notificationPreferences;

    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select('*')
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const latestOnboarding =
      data?.onboarding_data && typeof data.onboarding_data === 'object'
        ? (data.onboarding_data as Record<string, unknown>)
        : {};
    const latestNotifications =
      data?.notification_preferences && typeof data.notification_preferences === 'object'
        ? (data.notification_preferences as Record<string, unknown>)
        : {};

    return NextResponse.json({
      user: {
        ...data,
        language: data?.locale ?? null,
        wedding_date: (latestOnboarding.wedding_date as string) || (latestOnboarding.eventDate as string) || null,
        guest_count: latestOnboarding.guest_count ?? latestOnboarding.guestCount ?? null,
        budget: latestOnboarding.budget ?? null,
        email_notifications:
          typeof latestNotifications.email_notifications === 'boolean'
            ? latestNotifications.email_notifications
            : typeof latestNotifications.email === 'boolean'
              ? latestNotifications.email
              : true,
        whatsapp_notifications:
          typeof latestNotifications.whatsapp_notifications === 'boolean'
            ? latestNotifications.whatsapp_notifications
            : typeof latestNotifications.whatsapp === 'boolean'
              ? latestNotifications.whatsapp
              : false,
      },
    });
  } catch (error: any) {
    console.error('API Error in PATCH /api/profiles/me:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error?.message },
      { status: 500 }
    );
  }
}
