import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { CURRENT_YEAR } from '@/lib/constants';

export default function Footer() {
  const t = useTranslations('footer');

  const footerSections = [
    {
      title: 'Wedding Services',
      links: [
        { name: 'Wedding Venues', href: '/categories/venues' },
        { name: 'Catering Services', href: '/categories/catering' },
        { name: 'Photography & Video', href: '/categories/photo-video' },
        { name: 'Wedding Planning', href: '/categories/planning' },
        { name: 'Beauty & Henna', href: '/categories/beauty' },
        { name: 'Decor & Styling', href: '/categories/decor' },
        { name: 'Music & Entertainment', href: '/categories/music' },
        { name: 'Wedding Dresses', href: '/categories/dresses' }
      ]
    },
    {
      title: 'Planning Resources',
      links: [
        { name: 'Wedding Blog', href: '/blog' },
        { name: 'Planning Guide', href: '/planning-guide' },
        { name: 'Vendor Directory', href: '/vendors' },
        { name: 'Wedding Checklist', href: '/checklist' },
        { name: 'Budget Calculator', href: '/budget-calculator' },
        { name: 'Wedding Timeline', href: '/timeline' },
        { name: 'Moroccan Traditions', href: '/traditions' }
      ]
    },
    {
      title: 'For Vendors',
      links: [
        { name: 'Become a Vendor', href: '/become-vendor' },
        { name: 'Vendor Login', href: '/vendor-login' },
        { name: 'Vendor Dashboard', href: '/vendor-dashboard' },
        { name: 'Pricing Plans', href: '/vendor-pricing' },
        { name: 'Vendor Support', href: '/vendor-support' },
        { name: 'Marketing Tools', href: '/vendor-tools' }
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About Wervice', href: '/about' },
        { name: 'How It Works', href: '/how-it-works' },
        { name: 'Success Stories', href: '/success-stories' },
        { name: 'Press & Media', href: '/press' },
        { name: 'Careers', href: '/careers' },
        { name: 'Contact Us', href: '/contact' }
      ]
    }
  ];

  return (
    <footer className="bg-black text-white">
      {/* Newsletter Signup */}
      <div className="bg-[#d9ff0a] py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-black mb-4">
              Stay Updated with Moroccan Wedding Trends
            </h3>
            <p className="text-black/80 mb-6 max-w-2xl mx-auto">
              Get exclusive access to wedding inspiration, vendor deals, and planning tips delivered to your inbox.
            </p>
            <div className="max-w-md mx-auto flex gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-full border-2 border-black text-black placeholder-black/60 focus:outline-none focus:ring-2 focus:ring-black"
              />
              <button className="px-6 py-3 bg-black text-[#d9ff0a] font-semibold rounded-full hover:bg-gray-900 transition-colors duration-200">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <Link href="/" className="inline-block mb-6">
                <div className="text-3xl font-bold text-[#d9ff0a] mb-2">Wervice</div>
                <div className="text-sm text-white/60">Morocco's Wedding Marketplace</div>
              </Link>
              <p className="text-white/80 text-sm leading-relaxed mb-6">
                Connecting couples with Morocco's finest wedding vendors. From traditional riads to modern celebrations,
                find everything you need for your perfect Moroccan wedding.
              </p>

              {/* Contact Info */}
              <div className="space-y-2 text-sm text-white/60">
                <div className="flex items-center gap-2">
                  <span>📧</span>
                  <span>hello@wervice.ma</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📞</span>
                  <span>+212 6XX XXX XXX</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📍</span>
                  <span>Marrakech, Morocco</span>
                </div>
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
                        href={link.href}
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

          {/* Bottom Section */}
          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              {/* Social Media */}
              <div className="flex items-center gap-4">
                <span className="text-white/60 text-sm mr-4">Follow Us:</span>
                <div className="flex gap-3">
                  <a
                    href="https://facebook.com/wervice"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-[#d9ff0a] text-black rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200"
                    aria-label="Follow us on Facebook"
                  >
                    📘
                  </a>
                  <a
                    href="https://instagram.com/wervice"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-[#d9ff0a] text-black rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200"
                    aria-label="Follow us on Instagram"
                  >
                    📷
                  </a>
                  <a
                    href="https://twitter.com/wervice"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-[#d9ff0a] text-black rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200"
                    aria-label="Follow us on Twitter"
                  >
                    🐦
                  </a>
                  <a
                    href="https://linkedin.com/company/wervice"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-[#d9ff0a] text-black rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200"
                    aria-label="Follow us on LinkedIn"
                  >
                    💼
                  </a>
                </div>
              </div>

              {/* Legal Links */}
              <div className="flex flex-wrap gap-6 text-sm text-white/60">
                <Link href="/privacy" className="hover:text-[#d9ff0a] transition-colors duration-200">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="hover:text-[#d9ff0a] transition-colors duration-200">
                  Terms of Service
                </Link>
                <Link href="/cookies" className="hover:text-[#d9ff0a] transition-colors duration-200">
                  Cookie Policy
                </Link>
                <Link href="/sitemap" className="hover:text-[#d9ff0a] transition-colors duration-200">
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
