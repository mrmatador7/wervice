import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import type { ReactNode } from 'react';
import OnboardingGuard from '@/app/(guards)/onboarding-guard';
import { UserProvider } from '@/contexts/UserContext';

const locales = ['en', 'fr', 'ar'] as const;
const defaultLocale = 'en';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const localeParam = (await params)?.locale || defaultLocale;
  // Ensure that the incoming `locale` is valid, default to 'en' if not
  const locale = locales.includes(localeParam as typeof locales[number]) ? localeParam : defaultLocale;
  const messages = await getMessages({ locale });

  return {
    title: messages.metadata?.title as string || "Wervice - Moroccan Wedding Planning",
    description: messages.metadata?.description as string || "Authentic Moroccan weddings made easy",
    keywords: messages.metadata?.keywords as string || "Moroccan weddings, henna ceremonies, kaftans",
  };
}

export default async function RootLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const localeParam = (await params)?.locale || defaultLocale;
  // Ensure that the incoming `locale` is valid, default to 'en' if not
  const locale = locales.includes(localeParam as typeof locales[number]) ? localeParam : defaultLocale;

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages({ locale });

  const isRTL = locale === 'ar';

  return (
    <NextIntlClientProvider messages={messages}>
      <UserProvider>
        <div
          dir={isRTL ? 'rtl' : 'ltr'}
          lang={locale}
          style={{
            fontFamily: isRTL ? "'Readex Pro', system-ui, sans-serif" : "Rubik, system-ui, sans-serif",
            width: '100%',
            height: '100%'
          }}
        >
          <OnboardingGuard locale={locale}>
            {children}
          </OnboardingGuard>
        </div>
      </UserProvider>
    </NextIntlClientProvider>
  );
}
