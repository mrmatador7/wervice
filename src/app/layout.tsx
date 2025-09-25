import type { Metadata } from "next";
import { Rubik, Allan, Readex_Pro } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Wervice - Moroccan Wedding Planning",
  description: "Authentic Moroccan weddings made easy",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={`${rubik.variable} ${readexPro.variable} ${allan.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}
