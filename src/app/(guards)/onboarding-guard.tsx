'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';

interface OnboardingGuardProps {
    children: ReactNode;
    locale: string;
}

export default function OnboardingGuard({ children, locale }: OnboardingGuardProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [isChecking, setIsChecking] = useState(true);
    const { user, profile, isLoading: userLoading } = useUser();

    useEffect(() => {
        const checkOnboardingStatus = () => {
            const isAuthPage = pathname.includes('/auth');

            // Completely bypass all checks for auth pages
            if (isAuthPage) {
                setIsChecking(false);
                return;
            }

            // Wait for user data to load
            if (userLoading) {
                return;
            }

            // If no user, redirect to sign-in
            if (!user) {
                router.replace(`/${locale}/auth/signin`);
                return;
            }

            // Check if user needs to complete onboarding
            const isOnboarded = profile?.onboarded ?? false;
            const isOnboardingPage = pathname.includes('/onboarding');

            if (isOnboardingPage && isOnboarded) {
                // User is onboarded but trying to access onboarding, redirect to account
                router.replace(`/${locale}/account`);
                return;
            }

            if (!isOnboardingPage && !isOnboarded) {
                // User is not onboarded and not on onboarding page, redirect to onboarding
                router.replace(`/${locale}/onboarding`);
                return;
            }

            // All good, allow access
            setIsChecking(false);

            // All checks passed
            setIsChecking(false);
        };

        checkOnboardingStatus();
    }, [locale, pathname, router, user, profile, userLoading]);

    // Show loading while checking
    if (isChecking) {
        return (
            <div className="min-h-screen bg-[#F6F5F2] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-[#D9FF0A] rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">⏳</span>
                    </div>
                    <p className="text-[#787664]">Checking your account...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
