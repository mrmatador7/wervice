'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { FiMenu, FiX, FiChevronDown, FiUser, FiBriefcase } from 'react-icons/fi';

interface LanguageCurrency {
    language: string;
    currency: string;
}

const languages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'ar', name: 'العربية' }
];

const currencies = [
    { code: 'USD', symbol: '$' },
    { code: 'EUR', symbol: '€' },
    { code: 'MAD', symbol: 'MAD' }
];

export default function GlassmorphismHeader() {
    const router = useRouter();
    const pathname = usePathname();
    const t = useTranslations('header');
    const tc = useTranslations('categories');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLangCurrOpen, setIsLangCurrOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [selectedLangCurr, setSelectedLangCurr] = useState<LanguageCurrency>({
        language: 'en',
        currency: 'USD'
    });

    // Load saved preferences from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('user-preferences');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setSelectedLangCurr(parsed);
            } catch (error) {
                console.error('Error parsing saved preferences:', error);
            }
        }
    }, []);

    // Handle scroll detection for logo and categories visibility
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const threshold = 100; // Hide categories after scrolling 100px
            setIsScrolled(scrollTop > threshold);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Handle language change with navigation
    const handleLanguageChange = (newLanguage: string) => {
        const newPrefs = { ...selectedLangCurr, language: newLanguage };
        localStorage.setItem('user-preferences', JSON.stringify(newPrefs));
        setSelectedLangCurr(newPrefs);

        // Navigate to the new locale route
        // Remove current locale from pathname and add new one
        const currentLocale = pathname.split('/')[1];
        const pathWithoutLocale = pathname.replace(`/${currentLocale}`, '');
        const newPath = `/${newLanguage}${pathWithoutLocale || '/'}`;

        router.push(newPath);
        closeAllMenus();
    };

    // Save currency preferences to localStorage (no navigation needed)
    const handleCurrencyChange = (newCurrency: string) => {
        const newPrefs = { ...selectedLangCurr, currency: newCurrency };
        localStorage.setItem('user-preferences', JSON.stringify(newPrefs));
        setSelectedLangCurr(newPrefs);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        setIsLangCurrOpen(false);
    };

    const closeAllMenus = () => {
        setIsMobileMenuOpen(false);
        setIsLangCurrOpen(false);
    };

    const currentLanguage = languages.find(lang => lang.code === selectedLangCurr.language);
    const currentCurrency = currencies.find(curr => curr.code === selectedLangCurr.currency);

    return (
        <>
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/30 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <Link
                                href="/"
                                className="flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent rounded-lg"
                                aria-label="Go to homepage"
                            >
                                <img
                                    src={isScrolled ? "/wervice-logo-black.png" : "/wervice-logo.png"}
                                    alt="Wervice Logo"
                                    className="w-24 h-8 sm:w-30 sm:h-10 object-contain transition-all duration-300"
                                />
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-4">
                            {/* Language & Currency Selector */}
                            <div className="relative">
                                <button
                                    onClick={() => {
                                        setIsLangCurrOpen(!isLangCurrOpen);
                                    }}
                                    className="flex items-center space-x-2 px-3 py-2 bg-white text-black border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent"
                                    aria-label="Select language and currency"
                                    aria-expanded={isLangCurrOpen}
                                    aria-haspopup="true"
                                >
                                    <span className="text-sm font-medium text-black">
                                        {currentLanguage?.code.toUpperCase()} | {currentCurrency?.code}
                                    </span>
                                    <FiChevronDown className={`w-4 h-4 text-gray-700 transition-transform duration-200 ${isLangCurrOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Language & Currency Dropdown */}
                                {isLangCurrOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white/90 backdrop-blur-md border border-white/30 rounded-lg shadow-xl z-50">
                                        <div className="p-4">
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">{t('language')}</label>
                                                <select
                                                    value={selectedLangCurr.language}
                                                    onChange={(e) => handleLanguageChange(e.target.value)}
                                                    className="w-full px-3 py-2 bg-white/50 backdrop-blur-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                >
                                                    {languages.map((lang) => (
                                                        <option key={lang.code} value={lang.code}>
                                                            {lang.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">{t('currency')}</label>
                                                <select
                                                    value={selectedLangCurr.currency}
                                                    onChange={(e) => handleCurrencyChange(e.target.value)}
                                                    className="w-full px-3 py-2 bg-white/50 backdrop-blur-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                >
                                                    {currencies.map((curr) => (
                                                        <option key={curr.code} value={curr.code}>
                                                            {curr.symbol} {curr.code}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Sign In Button */}
                            <Link
                                href="/sign-in"
                                className="flex items-center space-x-2 px-4 py-2 bg-[#d9ff0a] hover:bg-[#c4e600] text-black font-medium rounded-lg hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#d9ff0a] focus:ring-offset-2 focus:ring-offset-transparent shadow-lg"
                                aria-label="Sign in to your account"
                            >
                                <FiUser className="w-4 h-4" />
                                <span>{t('signIn')}</span>
                            </Link>

                            {/* Become a Vendor Button */}
                            <Link
                                href="/vendor-signup"
                                className="flex items-center space-x-2 px-4 py-2 bg-black hover:bg-gray-900 text-[#d9ff0a] font-medium rounded-lg hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#d9ff0a] focus:ring-offset-2 focus:ring-offset-transparent shadow-lg"
                                aria-label="Become a vendor and start offering services"
                            >
                                <FiBriefcase className="w-4 h-4" />
                                <span>{t('becomeVendor')}</span>
                            </Link>

                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={toggleMobileMenu}
                            className="md:hidden p-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-lg hover:bg-white/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent"
                            aria-label="Toggle mobile menu"
                            aria-expanded={isMobileMenuOpen}
                        >
                            {isMobileMenuOpen ? (
                                <FiX className="w-6 h-6 text-gray-700" />
                            ) : (
                                <FiMenu className="w-6 h-6 text-gray-700" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Categories Navigation - Only show when at top */}
                {!isScrolled && (
                    <div className="hidden md:block bg-white/5 backdrop-blur-sm border-t border-white/10">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <nav className="flex items-center justify-center space-x-8 py-3">
                                <Link
                                    href="/categories/venues"
                                    className="text-white/80 hover:text-white font-medium text-sm transition-colors duration-200 hover:scale-105 transform"
                                >
                                    {tc('venues')}
                                </Link>
                                <Link
                                    href="/categories/dresses"
                                    className="text-white/80 hover:text-white font-medium text-sm transition-colors duration-200 hover:scale-105 transform"
                                >
                                    {tc('dresses')}
                                </Link>
                                <Link
                                    href="/categories/catering"
                                    className="text-white/80 hover:text-white font-medium text-sm transition-colors duration-200 hover:scale-105 transform"
                                >
                                    {tc('catering')}
                                </Link>
                                <Link
                                    href="/categories/photoVideo"
                                    className="text-white/80 hover:text-white font-medium text-sm transition-colors duration-200 hover:scale-105 transform"
                                >
                                    {tc('photoVideo')}
                                </Link>
                                <Link
                                    href="/categories/planningBeauty"
                                    className="text-white/80 hover:text-white font-medium text-sm transition-colors duration-200 hover:scale-105 transform"
                                >
                                    {tc('planningBeauty')}
                                </Link>
                                <Link
                                    href="/categories/decor"
                                    className="text-white/80 hover:text-white font-medium text-sm transition-colors duration-200 hover:scale-105 transform"
                                >
                                    {tc('decor')}
                                </Link>
                                <Link
                                    href="/categories/music"
                                    className="text-white/80 hover:text-white font-medium text-sm transition-colors duration-200 hover:scale-105 transform"
                                >
                                    {tc('music')}
                                </Link>
                            </nav>
                        </div>
                    </div>
                )}
            </header>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-40 md:hidden">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                        onClick={closeAllMenus}
                    />

                    {/* Mobile Menu Panel */}
                    <div className="absolute right-0 top-0 h-full w-80 max-w-[90vw] bg-white/95 backdrop-blur-md border-l border-white/30 shadow-2xl transform transition-transform duration-300 ease-in-out">
                        <div className="flex flex-col h-full">
                            {/* Mobile Menu Header */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                <span className="text-lg font-semibold text-gray-900">{t('menu')}</span>
                                <button
                                    onClick={closeAllMenus}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    aria-label="Close menu"
                                >
                                    <FiX className="w-6 h-6 text-gray-700" />
                                </button>
                            </div>

                            {/* Mobile Menu Content */}
                            <div className="flex-1 px-6 py-6 space-y-4">
                                {/* Language & Currency Selector */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('language')} & {t('currency')}</label>
                                    <div className="space-y-2">
                                        <select
                                            value={selectedLangCurr.language}
                                            onChange={(e) => handleLanguageChange(e.target.value)}
                                            className="w-full px-3 py-2 bg-white/50 backdrop-blur-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            {languages.map((lang) => (
                                                <option key={lang.code} value={lang.code}>
                                                    {lang.name}
                                                </option>
                                            ))}
                                        </select>
                                        <select
                                            value={selectedLangCurr.currency}
                                            onChange={(e) => handleCurrencyChange(e.target.value)}
                                            className="w-full px-3 py-2 bg-white/50 backdrop-blur-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            {currencies.map((curr) => (
                                                <option key={curr.code} value={curr.code}>
                                                    {curr.symbol} {curr.code}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Mobile Menu Links */}
                                <div className="space-y-2">
                                    <Link
                                        href="/sign-in"
                                        className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-[#d9ff0a] hover:bg-[#c4e600] text-black font-medium rounded-lg hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#d9ff0a] focus:ring-offset-2 shadow-lg"
                                        onClick={closeAllMenus}
                                    >
                                        <FiUser className="w-5 h-5" />
                                        <span>{t('signIn')}</span>
                                    </Link>
                                    <Link
                                        href="/vendor-signup"
                                        className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-black hover:bg-gray-900 text-[#d9ff0a] font-medium rounded-lg hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#d9ff0a] focus:ring-offset-2 shadow-lg"
                                        onClick={closeAllMenus}
                                    >
                                        <FiBriefcase className="w-5 h-5" />
                                        <span>{t('becomeVendor')}</span>
                                    </Link>
                                </div>

                                {/* Mobile Categories */}
                                <div className="border-t border-gray-200 pt-4">
                                    <div className="space-y-2">
                                        <Link
                                            href="/categories/venues"
                                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100/50 rounded-lg transition-colors duration-200"
                                            onClick={closeAllMenus}
                                        >
                                            {tc('venues')}
                                        </Link>
                                        <Link
                                            href="/categories/dresses"
                                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100/50 rounded-lg transition-colors duration-200"
                                            onClick={closeAllMenus}
                                        >
                                            {tc('dresses')}
                                        </Link>
                                        <Link
                                            href="/categories/catering"
                                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100/50 rounded-lg transition-colors duration-200"
                                            onClick={closeAllMenus}
                                        >
                                            {tc('catering')}
                                        </Link>
                                        <Link
                                            href="/categories/photoVideo"
                                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100/50 rounded-lg transition-colors duration-200"
                                            onClick={closeAllMenus}
                                        >
                                            {tc('photoVideo')}
                                        </Link>
                                        <Link
                                            href="/categories/planningBeauty"
                                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100/50 rounded-lg transition-colors duration-200"
                                            onClick={closeAllMenus}
                                        >
                                            {tc('planningBeauty')}
                                        </Link>
                                        <Link
                                            href="/categories/decor"
                                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100/50 rounded-lg transition-colors duration-200"
                                            onClick={closeAllMenus}
                                        >
                                            {tc('decor')}
                                        </Link>
                                        <Link
                                            href="/categories/music"
                                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100/50 rounded-lg transition-colors duration-200"
                                            onClick={closeAllMenus}
                                        >
                                            {tc('music')}
                                        </Link>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
