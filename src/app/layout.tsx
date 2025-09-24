import type { Metadata } from "next";
import { Amiri, Open_Sans } from "next/font/google";
import "./globals.css";

const amiri = Amiri({
  subsets: ["latin", "arabic"],
  weight: ["400", "700"],
  variable: "--font-amiri",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-open-sans",
});

export const metadata: Metadata = {
  title: "Wervice - Moroccan Wedding Planning",
  description: "Authentic Moroccan weddings made easy with categories like Venues, Dresses, and Decor. Plan your perfect celebration with traditional henna, kaftans, and Amaria processions.",
  keywords: "Moroccan weddings, henna ceremonies, kaftans, Amaria processions, Riad venues, traditional catering, wedding planning Morocco",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${amiri.variable} ${openSans.variable}`}>
        <head>
        <meta name="apple-mobile-web-app-title" content="Wervice" />
        </head>
      <body className="font-sans">
        {children}
      </body>
    </html>
  );
}
