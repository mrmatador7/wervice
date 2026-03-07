'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { AUTH_UI_ENABLED } from '@/lib/config';

export default function SignInPage() {
    const router = useRouter();
    const t = useTranslations('auth');
    const locale = useLocale();

    const [signinData, setSigninData] = useState({
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleCustomSignin = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!agreedToTerms) {
            setError('Please agree to the Terms & Privacy to continue');
            return;
        }
        
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    email: signinData.email,
                    password: signinData.password
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Sign in failed');
                setIsLoading(false);
                return;
            }

            console.log('Signin response data:', { 
                hasUser: !!data.user, 
                user_type: data.user_type,
                userId: data.user?.id 
            });

            if (data.user) {
                const userInfo = {
                    id: data.user.id,
                    email: data.user.email,
                    signedInAt: new Date().toISOString()
                };
                localStorage.setItem('wervice_user', JSON.stringify(userInfo));
                
                // Store user_type in localStorage for immediate access
                if (data.user_type) {
                    const profileInfo = {
                        user_type: data.user_type,
                        id: data.user.id,
                        email: data.user.email
                    };
                    localStorage.setItem('wervice_profile', JSON.stringify(profileInfo));
                }
            }

            // Redirect admins to admin dashboard, others to account page
            const isAdmin = data.user_type === 'admin' || data.user_type === 'super_admin';
            console.log('Redirect check:', { 
                user_type: data.user_type, 
                isAdmin,
                email: data.user?.email,
                userId: data.user?.id
            });
            
            if (isAdmin) {
                console.log('Redirecting admin to /admin/dashboard');
                // Clear any previous state and redirect
                // Small delay to ensure cookies are set and localStorage is updated
                setTimeout(() => {
                    window.location.href = '/admin/dashboard';
                }, 200);
            } else {
                console.log('Redirecting user to account page');
                window.location.replace(`/${locale}/account`);
            }

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.';
            setError(errorMessage);
            setIsLoading(false);
        }
    };

    const handleGoogleSignin = () => {
        // TODO: Implement Google OAuth
        alert('Google sign in coming soon!');
    };

    const handleAppleSignin = () => {
        // TODO: Implement Apple OAuth
        alert('Apple sign in coming soon!');
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row">
            {/* Left Side - Mesh Gradient Background */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                {/* Mesh Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-wervice-lime via-lime-300 to-yellow-200">
                    <div className="absolute inset-0 opacity-40">
                        <div className="absolute top-0 left-0 w-96 h-96 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                        <div className="absolute bottom-0 left-20 w-96 h-96 bg-lime-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
                    </div>
                </div>
                
                <div className="relative z-10 flex flex-col justify-center items-center p-12 w-full">
                    <div className="text-center">
                        <Link href={`/${locale}`}>
                            <Image 
                                src="/wervice-logo-black.png" 
                                alt="Wervice Logo" 
                                width={200} 
                                height={60}
                                className="mb-12 mx-auto"
                            />
                        </Link>
                        <h1 className="text-5xl font-bold leading-tight mb-6 text-gray-900">
                            You can easily
                            <br />
                            <span className="text-gray-800">Speed up your work</span>
                            <br />
                            <span className="text-gray-800">with our Web App</span>
                        </h1>
                    </div>
                </div>
            </div>

            {/* Right Side - Sign In Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden mb-8 text-center">
                        <Link href={`/${locale}`}>
                            <Image 
                                src="/wervice-logo-black.png" 
                                alt="Wervice Logo" 
                                width={140} 
                                height={40}
                                className="mx-auto"
                            />
                        </Link>
                    </div>

                    <div className="mb-10">
                        <h2 className="text-4xl font-bold text-gray-900 mb-2">Get Started Now</h2>
                        <p className="text-gray-500">Please log in to your account to continue.</p>
                    </div>

                    <form onSubmit={handleCustomSignin} className="space-y-5">
                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={signinData.email}
                                onChange={(e) => setSigninData({ ...signinData, email: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-wervice-lime focus:border-transparent transition-all outline-none"
                                placeholder="workmail@gmail.com"
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <Link 
                                    href={`/${locale}/auth/reset-password`}
                                    className="text-sm text-indigo-600 hover:text-indigo-700 transition-colors"
                                >
                                    Forgot Password?
                                </Link>
                            </div>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    required
                                    value={signinData.password}
                                    onChange={(e) => setSigninData({ ...signinData, password: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-wervice-lime focus:border-transparent transition-all outline-none pr-10"
                                    placeholder="••••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Terms Checkbox */}
                        <div className="flex items-center">
                            <input
                                id="terms"
                                type="checkbox"
                                checked={agreedToTerms}
                                onChange={(e) => setAgreedToTerms(e.target.checked)}
                                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-wervice-lime"
                            />
                            <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                                I agree to the{' '}
                                <Link href={`/${locale}/terms`} className="text-indigo-600 hover:underline">
                                    Terms
                                </Link>
                                {' '}&{' '}
                                <Link href={`/${locale}/privacy`} className="text-indigo-600 hover:underline">
                                    Privacy
                                </Link>
                            </label>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3.5 px-4 rounded-xl transition-all focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-lg shadow-indigo-600/30"
                        >
                            {isLoading ? 'Signing in...' : 'Log in'}
                        </button>
                    </form>

                    {/* Sign Up Link */}
                    {AUTH_UI_ENABLED && (
                        <p className="text-center mt-6 text-sm text-gray-600">
                            Have an account?{' '}
                            <Link 
                                href={`/${locale}/auth/signup`}
                                className="text-indigo-600 hover:text-indigo-700 font-semibold"
                            >
                                Sign up
                            </Link>
                        </p>
                    )}

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500">Or</span>
                        </div>
                    </div>

                    {/* Social Sign In */}
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={handleGoogleSignin}
                            className="flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            <span className="text-sm font-medium text-gray-700">Login with Google</span>
                        </button>

                        <button
                            type="button"
                            onClick={handleAppleSignin}
                            className="flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                            </svg>
                            <span className="text-sm font-medium text-gray-700">Login with Apple</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
