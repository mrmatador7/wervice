'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';

interface OnboardingGuardProps {
    children: ReactNode;
    locale: string;
}

export default function OnboardingGuard({ children, locale }: OnboardingGuardProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, profile, isLoading: userLoading } = useUser();

    useEffect(() => {
        const checkOnboardingStatus = () => {
            const isAuthPage = pathname.includes('/auth');

            // Completely bypass all checks for auth pages
            if (isAuthPage) {
                return;
            }

            // Define public pages that don't require authentication
            const publicPages = [
                '/',
                '/home',
                '/about',
                '/how-it-works',
                '/guides',
                '/blog',
                '/contact',
                '/cookies',
                '/privacy',
                '/terms',
                '/become-vendor',
                '/categories',
                '/vendors',
                '/cities'
            ];

            // Check if current page is public
            const isPublicPage = publicPages.some(page => {
                const fullPath = page === '/' ? `/${locale}` : `/${locale}${page}`;
                return pathname === fullPath || pathname.startsWith(`${fullPath}/`);
            });

            // Allow access to public pages without authentication
            if (isPublicPage) {
                return;
            }

            // Wait for user data to load
            if (userLoading) {
                return;
            }

            // If no user and not on a public page, redirect to sign-in
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
        };

        checkOnboardingStatus();
    }, [locale, pathname, router, user, profile, userLoading]);

    return <>{children}</>;
}
