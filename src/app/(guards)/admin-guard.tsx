'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, profile, isLoading } = useUser();
  const [isChecking, setIsChecking] = useState(true);

  // Check localStorage immediately for cached data
  useEffect(() => {
    // Give UserContext a moment to initialize
    const checkAuth = () => {
      // First check localStorage for immediate access
      try {
        const cachedProfile = localStorage.getItem('wervice_profile');
        const cachedUser = localStorage.getItem('wervice_user');
        
        if (cachedProfile && cachedUser) {
          const parsedProfile = JSON.parse(cachedProfile);
          const parsedUser = JSON.parse(cachedUser);
          
          console.log('AdminGuard: Found cached data', {
            hasCachedUser: !!parsedUser,
            cachedUserType: parsedProfile.user_type
          });
          
          // If we have cached admin data, we can proceed
          if (parsedProfile.user_type === 'admin' || parsedProfile.user_type === 'super_admin') {
            setIsChecking(false);
            return;
          }
        }
      } catch (e) {
        console.error('AdminGuard: Error reading localStorage:', e);
      }
      
      // Wait a bit for UserContext to load
      const timer = setTimeout(() => {
        setIsChecking(false);
      }, 500);
      
      return () => clearTimeout(timer);
    };
    
    const cleanup = checkAuth();
    return cleanup;
  }, []);

  useEffect(() => {
    // Wait for initial check and user data to load
    if (isChecking || isLoading) {
      return;
    }

    // Check localStorage first as fallback
    let userType = profile?.user_type;
    let hasUser = !!user;
    
    if (!userType || !hasUser) {
      try {
        const cachedProfile = localStorage.getItem('wervice_profile');
        const cachedUser = localStorage.getItem('wervice_user');
        
        if (cachedProfile) {
          const parsed = JSON.parse(cachedProfile);
          userType = parsed.user_type;
          console.log('AdminGuard: Using cached user_type from localStorage:', userType);
        }
        
        if (cachedUser) {
          hasUser = true;
        }
      } catch (e) {
        console.error('AdminGuard: Error reading localStorage:', e);
      }
    }

    console.log('AdminGuard: Checking access', {
      hasUser,
      hasProfile: !!profile,
      userType,
      isLoading,
      isChecking
    });

    // If still no user after checking everything, redirect to sign in
    if (!hasUser) {
      console.log('AdminGuard: No user found, redirecting to signin');
      router.replace('/en/auth/signin');
      return;
    }

    const isAdmin = userType === 'admin' || userType === 'super_admin';

    // Only redirect if we're sure the user is not an admin
    // If userType is still undefined, wait a bit more for profile to load
    if (userType !== undefined && !isAdmin) {
      // User is not an admin, redirect to account page
      console.log('AdminGuard: User is not admin, redirecting to account');
      const locale = pathname.split('/')[1] || 'en';
      router.replace(`/${locale}/account`);
      return;
    }
  }, [user, profile, isLoading, isChecking, router, pathname]);

  // Show loading state while checking or loading
  if (isChecking || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Check for user in state or localStorage
  let hasUser = !!user;
  if (!hasUser) {
    try {
      const cachedUser = localStorage.getItem('wervice_user');
      hasUser = !!cachedUser;
    } catch (e) {
      // Ignore errors
    }
  }

  // If no user, don't render children (redirect is happening)
  if (!hasUser) {
    return null;
  }

  // Check if user is admin or super_admin
  // First check profile, then fallback to localStorage if profile hasn't loaded yet
  let userType = profile?.user_type;
  
  // If profile hasn't loaded yet, check localStorage (set during signin)
  if (!userType) {
    try {
      const cachedProfile = localStorage.getItem('wervice_profile');
      if (cachedProfile) {
        const parsed = JSON.parse(cachedProfile);
        userType = parsed.user_type;
      }
    } catch (e) {
      // Ignore localStorage errors
    }
  }

  const isAdmin = userType === 'admin' || userType === 'super_admin';

  // If userType is still undefined and we're not loading, wait a bit more
  // This handles the case where profile hasn't loaded yet but isLoading is false
  if (userType === undefined) {
    console.log('AdminGuard: userType is undefined, showing loading state');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    console.log('AdminGuard: User is not admin, not rendering children');
    return null;
  }

  // User is admin, render children
  console.log('AdminGuard: User is admin, rendering children');
  return <>{children}</>;
}

