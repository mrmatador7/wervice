'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import Header from '@/components/layout/Header';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function DashboardPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const locale = useLocale();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [profile, setProfile] = useState<Record<string, any> | null>(null);
    const [profileLoading, setProfileLoading] = useState(false);

    useEffect(() => {
        if (!isLoading && user) {
            if (!user.id) {
                console.error('Dashboard: User object exists but has no ID!');
                setProfile(null);
                return;
            }

            // Fetch user profile
            const fetchProfile = async () => {
                setProfileLoading(true);
                try {
                    console.log('Dashboard: Fetching profile for user:', user.id);

                    const { data, error } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', user.id)
                        .single();

                    if (error) {
                        console.error('Error fetching profile:', error);
                        console.error('Error details:', {
                            message: error.message,
                            details: error.details,
                            hint: error.hint,
                            code: error.code,
                            fullError: JSON.stringify(error, null, 2)
                        });

                        // If profile doesn't exist (PGRST116) or error is empty (indicating no profile found)
                        const isProfileNotFound = error.code === 'PGRST116' ||
                            (error.code === undefined && Object.keys(error).length === 0) ||
                            (error.message && error.message.includes('No rows found'));


                        if (isProfileNotFound) {
                            console.log('Dashboard: Profile not found, creating new profile for user:', user.id);
                            try {
                                const { data: newProfile, error: createError } = await supabase
                                    .from('profiles')
                                    .upsert({
                                        id: user.id,
                                        onboarded: false,
                                        user_type: 'user', // Default to user
                                        user_status: 'active'
                                    }, {
                                        onConflict: 'id'
                                    })
                                    .select('*')
                                    .single();

                                if (createError) {
                                    // If profile already exists (conflict), try to fetch it again
                                    if (createError.code === '23505') { // Unique violation
                                        console.log('Dashboard: Profile already exists, fetching...');
                                        const { data: existingProfile, error: fetchError } = await supabase
                                            .from('profiles')
                                            .select('*')
                                            .eq('id', user.id)
                                            .single();

                                        if (fetchError) {
                                            console.error('Dashboard: Error fetching existing profile:', fetchError);
                                            setProfile(null);
                                        } else {
                                            console.log('Dashboard: Existing profile fetched:', existingProfile);
                                            setProfile(existingProfile);
                                        }
                                    } else {
                                        console.error('Dashboard: Error creating profile:', createError);
                                        setProfile(null);
                                    }
                                } else {
                                    console.log('Dashboard: ✅ Profile created successfully:', newProfile);
                                    setProfile(newProfile);
                                }
                            } catch (createErr) {
                                console.error('Dashboard: Unexpected error creating profile:', createErr);
                                setProfile(null);
                            }
                        } else {
                            console.error('Dashboard: Other error fetching profile:', error);
                            setProfile(null);
                        }
                    } else {
                        setProfile(data);
                    }
                } catch (err) {
                    console.error('Unexpected error fetching profile:', err);
                    setProfile(null);
                } finally {
                    setProfileLoading(false);
                }
            };

            fetchProfile();
        }
    }, [user, isLoading, router, locale]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect in useEffect
    }

    return (
        <div className="min-h-screen relative">
            {/* Background Image */}
            <div className="fixed inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                    alt="Beautiful Moroccan wedding scene with traditional elements"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40"></div>
            </div>

            {/* Content */}
            <div className="relative z-10">
                <Header />

                {/* Add top padding to account for fixed header */}
                <div className="pt-16 min-h-screen">
                    <div className="container mx-auto px-6 py-12">
                        <div className="max-w-6xl mx-auto">
                            {/* Welcome Section */}
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-8 border border-white/20">
                                <h1 className="text-4xl font-bold text-white mb-4">
                                    Welcome back, {user.email?.split('@')[0]}! 👋
                                </h1>
                                <p className="text-white/90 text-lg mb-4">
                                    Let&apos;s plan your perfect Moroccan wedding together.
                                </p>

                                {/* Profile Debug Info */}
                                {profile && (
                                    <div className="bg-black/20 rounded-lg p-4 mt-4">
                                        <h3 className="text-white font-semibold mb-2">🔍 Profile Information:</h3>
                                        <div className="text-white/80 text-sm space-y-1">
                                            <div><strong>User Type:</strong> {profile.user_type || 'Not set'}</div>
                                            <div><strong>User Status:</strong> {profile.user_status || 'Not set'}</div>
                                            <div><strong>Onboarded:</strong> {profile.onboarded ? '✅ Yes' : '❌ No'}</div>
                                            <div><strong>Name:</strong> {profile.first_name} {profile.last_name}</div>
                                            <div><strong>Email:</strong> {profile.email}</div>
                                            <div><strong>Phone:</strong> {profile.phone || 'Not set'}</div>
                                            <div><strong>City:</strong> {profile.city || 'Not set'}</div>
                                        </div>
                                    </div>
                                )}

                                {profileLoading && (
                                    <div className="bg-black/20 rounded-lg p-4 mt-4">
                                        <div className="text-white/80">Loading profile...</div>
                                    </div>
                                )}
                            </div>

                            {/* Quick Actions Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                                {/* Browse Vendors */}
                                <Link
                                    href={`/${locale}`}
                                    className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group"
                                >
                                    <div className="text-3xl mb-4">💒</div>
                                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-200">
                                        Browse Vendors
                                    </h3>
                                    <p className="text-white/80">
                                        Discover the best wedding vendors in Morocco
                                    </p>
                                </Link>

                                {/* My Reservations */}
                                <Link
                                    href={`/${locale}/reservations`}
                                    className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group"
                                >
                                    <div className="text-3xl mb-4">📅</div>
                                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-200">
                                        My Reservations
                                    </h3>
                                    <p className="text-white/80">
                                        View and manage your bookings
                                    </p>
                                </Link>

                                {/* Profile Settings */}
                                <Link
                                    href={`/${locale}/profile`}
                                    className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group"
                                >
                                    <div className="text-3xl mb-4">👤</div>
                                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-200">
                                        Profile Settings
                                    </h3>
                                    <p className="text-white/80">
                                        Update your account information
                                    </p>
                                </Link>
                            </div>

                            {/* Recent Activity Placeholder */}
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                                <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">📝</div>
                                    <p className="text-white/80 text-lg">
                                        Your wedding planning journey starts here!
                                    </p>
                                    <p className="text-white/60 mt-2">
                                        Browse vendors and start planning your special day.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
