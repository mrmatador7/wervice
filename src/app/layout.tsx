import type { Metadata } from "next";
import { Suspense } from "react";
import { Rubik, Allan, Readex_Pro, Poppins, Inter, Montserrat, Open_Sans } from "next/font/google";
import { Toaster } from "sonner";
import ClientHtml from "@/components/sections/ClientHtml";
import FirebaseAnalytics from '@/components/analytics/FirebaseAnalytics';
import { getSiteUrl } from '@/lib/seo/site-url';
import "./globals.css";

const rubik = Rubik({
  subsets: ["latin", "arabic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-rubik",
});

const readexPro = Readex_Pro({
  subsets: ["latin", "arabic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-readex-pro",
});

const allan = Allan({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-allan",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-open-sans",
});


export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: "Wervice - Moroccan Wedding Planning",
  description: "Authentic Moroccan weddings made easy",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.png",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientHtml
      className={`${rubik.variable} ${readexPro.variable} ${allan.variable} ${poppins.variable} ${inter.variable} ${montserrat.variable} ${openSans.variable}`}
    >
      <body>
        {children}
        <Suspense fallback={null}>
          <FirebaseAnalytics />
        </Suspense>
        <Toaster />
      </body>
    </ClientHtml>
  );
}
