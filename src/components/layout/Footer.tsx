'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useLocale } from '@/contexts/LocaleContext';
import { CURRENT_YEAR, FOOTER_CONTACT } from '@/lib/config';

export default function Footer() {
  // Suppress hydration warnings for this component as it may be affected by browser extensions
  const { locale: currentLocale } = useLocale();
  const t = useTranslations('footer');

  const footerSections = [
    {
      title: 'Wedding Services',
      links: [
        { name: 'Wedding Venues', href: '/categories/venues' },
        { name: 'Catering Services', href: '/categories/caterer' },
        { name: 'Photography & Video', href: '/categories/photo-film' },
        { name: 'Wedding Planning', href: '/categories/event-planner' },
        { name: 'Beauty & Henna', href: '/categories/beauty' },
        { name: 'Decor & Styling', href: '/categories/decor' },
        { name: 'Music & Entertainment', href: '/categories/artist' },
        { name: 'Wedding Dresses', href: '/categories/dresses' }
      ]
    },
    {
      title: 'Planning Resources',
      links: [
        { name: 'Wedding Articles', href: '/blog' },
        { name: 'Planning Guide', href: '/guides/planning' },
        { name: 'Wedding Checklist', href: '/checklist' },
        { name: 'Budget Calculator', href: '/budget-calculator' },
        { name: 'Wedding Timeline', href: '/timeline' },
        { name: 'Moroccan Traditions', href: '/traditions' }
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About Wervice', href: '/about' },
        { name: 'How It Works', href: '/how-it-works' },
        { name: 'Contact Us', href: '/contact' }
      ]
    }
  ];

  return (
    <footer className="relative text-white overflow-hidden" suppressHydrationWarning>
      {/* Mesh Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#11190C] via-[#1a2614] to-[#0d1109]">
        {/* Mesh gradient overlay */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#D9FF0A] rounded-full mix-blend-multiply filter blur-[128px] animate-blob"></div>
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#11190C] rounded-full mix-blend-multiply filter blur-[128px] animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-[500px] h-[500px] bg-[#8BC34A] rounded-full mix-blend-multiply filter blur-[128px] animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10 py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <Link href="/" className="inline-block mb-6">
                <div className="text-3xl font-bold text-[#d9ff0a] mb-2">Wervice</div>
                <div className="text-sm text-white/60">Morocco&apos;s Wedding Marketplace</div>
              </Link>
              <p className="text-white/80 text-sm leading-relaxed mb-6">
                Connecting couples with Morocco&apos;s finest wedding vendors. From traditional riads to modern celebrations,
                find everything you need for your perfect Moroccan wedding.
              </p>

              {/* Contact Info */}
              <div className="space-y-2 text-sm text-white/60">
                <a href={`mailto:${FOOTER_CONTACT.email}`} className="flex items-center gap-2 hover:text-[#d9ff0a] transition-colors">
                  <span>📧</span>
                  <span>{FOOTER_CONTACT.email}</span>
                </a>
                <a href={`tel:${FOOTER_CONTACT.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 hover:text-[#d9ff0a] transition-colors">
                  <span>📞</span>
                  <span>{FOOTER_CONTACT.phone}</span>
                </a>
              </div>
            </div>

            {/* Footer Sections */}
            {footerSections.map((section, index) => (
              <div key={index}>
                <h4 className="text-[#d9ff0a] font-semibold text-lg mb-4">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        href={
                          link.name === 'Wedding Checklist' ? `/${currentLocale}/checklist` :
                            link.name === 'How It Works' ? `/${currentLocale}/how-it-works` :
                              `/${currentLocale}${link.href}`
                        }
                        className="text-white/70 hover:text-[#d9ff0a] transition-colors duration-200 text-sm"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter Signup */}
          <div className="border-t border-white/10 pt-12 pb-8">
            <div className="text-center">
              <h3 className="text-xl md:text-2xl font-bold text-[#d9ff0a] mb-3">
                Stay Updated with Moroccan Wedding Trends
              </h3>
              <p className="text-white/70 text-sm mb-6 max-w-xl mx-auto">
                Get exclusive access to wedding inspiration, vendor deals, and planning tips delivered to your inbox.
              </p>
              <div className="max-w-md mx-auto flex gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-full border-2 border-white/20 bg-white/5 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#d9ff0a] focus:border-[#d9ff0a] transition-all duration-200"
                />
                <button className="px-6 py-3 bg-[#d9ff0a] text-black font-semibold rounded-full hover:bg-[#c4e600] hover:scale-105 transition-all duration-200">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              {/* Social Media */}
              <div className="flex items-center gap-4">
                <span className="text-white/60 text-sm mr-4">Follow Us:</span>
                <div className="flex gap-3" suppressHydrationWarning>
                  <a
                    href="https://facebook.com/wervice"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-[#d9ff0a] text-black rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200"
                    aria-label="Follow us on Facebook"
                    suppressHydrationWarning
                  >
                    📘
                  </a>
                  <a
                    href="https://instagram.com/wervice"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-[#d9ff0a] text-black rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200"
                    aria-label="Follow us on Instagram"
                    suppressHydrationWarning
                  >
                    📷
                  </a>
                  <a
                    href="https://twitter.com/wervice"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-[#d9ff0a] text-black rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200"
                    aria-label="Follow us on Twitter"
                    suppressHydrationWarning
                  >
                    🐦
                  </a>
                  <a
                    href="https://linkedin.com/company/wervice"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-[#d9ff0a] text-black rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200"
                    aria-label="Follow us on LinkedIn"
                    suppressHydrationWarning
                  >
                    💼
                  </a>
                </div>
              </div>

              {/* Legal Links */}
              <div className="flex flex-wrap gap-6 text-sm text-white/60">
                <Link href={`/${currentLocale}/privacy`} className="hover:text-[#d9ff0a] transition-colors duration-200">
                  Privacy Policy
                </Link>
                <Link href={`/${currentLocale}/terms`} className="hover:text-[#d9ff0a] transition-colors duration-200">
                  Terms of Service
                </Link>
                <Link href={`/${currentLocale}/cookies`} className="hover:text-[#d9ff0a] transition-colors duration-200">
                  Cookie Policy
                </Link>
                <Link href="/sitemap.xml" className="hover:text-[#d9ff0a] transition-colors duration-200">
                  Sitemap
                </Link>
              </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-white/10 mt-8 pt-6 text-center">
              <p className="text-white/40 text-sm">
                &copy; {CURRENT_YEAR} Wervice. All rights reserved. Made with ❤️ in Morocco for magical weddings worldwide.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
