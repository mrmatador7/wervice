'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useLocale } from 'next-intl';
import Header from '@/components/layout/Header';
import Link from 'next/link';

export default function DashboardPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const locale = useLocale();

    useEffect(() => {
        console.log(`[${new Date().toISOString()}] 📊 Dashboard page loaded:`, {
            userId: user?.id,
            isLoading,
            isAuthenticated: !!user,
            currentPath: window.location.pathname,
            locale
        });

        if (!isLoading && !user) {
            console.log(`[${new Date().toISOString()}] ❌ No user session, redirecting to signin`);
            // Redirect to sign in if not authenticated
            router.push(`/${locale}/auth/signin`);
        } else if (!isLoading && user) {
            console.log(`[${new Date().toISOString()}] ✅ User authenticated, showing dashboard`);
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
                                <p className="text-white/90 text-lg">
                                    Let&apos;s plan your perfect Moroccan wedding together.
                                </p>
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
