'use client';

import { createContext, useContext, useMemo } from 'react';
import { usePathname } from 'next/navigation';

interface LocaleContextType {
    locale: string;
    isRTL: boolean;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

const RTL_LOCALES = ['ar'];

export function LocaleProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const contextValue = useMemo(() => {
        const locale = pathname.split('/')[1] || 'en';
        const isRTL = RTL_LOCALES.includes(locale);

        return {
            locale,
            isRTL,
        };
    }, [pathname]);

    return (
        <LocaleContext.Provider value={contextValue}>
            {children}
        </LocaleContext.Provider>
    );
}

export function useLocale() {
    const context = useContext(LocaleContext);
    if (context === undefined) {
        throw new Error('useLocale must be used within a LocaleProvider');
    }
    return context;
}
