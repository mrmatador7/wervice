'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { HeroProps } from '@/models/types';
import { NAVBAR_CATEGORIES } from '@/lib/config';
import WerviceSearchBar from '@/components/ui/WerviceSearchBar';


export default function Hero({ onViewOffers }: HeroProps) {
  const t = useTranslations('hero');
  const locale = useLocale();

  // Determine fonts based on locale
  const isArabic = locale === 'ar';
  const headingFont = isArabic
    ? "'Readex Pro', system-ui, sans-serif"
    : "'Poppins', 'Inter', 'Montserrat', system-ui, sans-serif";
  const bodyFont = isArabic
    ? "'Readex Pro', system-ui, sans-serif"
    : "'Open Sans', 'Lora', system-ui, sans-serif";

  return (
    <section
      className="relative min-h-[80vh] flex items-center overflow-hidden"
      role="banner"
      aria-label="Hero section for Moroccan wedding planning"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            className="text-center lg:text-left rtl:lg:text-right"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h1
              className="font-heading-primary text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight mb-6 text-white"
              style={{
                fontFamily: headingFont,
                textShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {t('title')}
            </motion.h1>

            <motion.p
              className="font-body-primary text-lg md:text-xl lg:text-2xl mb-8 max-w-2xl text-white/90"
              style={{
                fontFamily: bodyFont
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {t('subtitle')}
            </motion.p>

            {/* Search Bar */}
            <motion.div
              className="mb-8 max-w-lg mx-auto lg:mx-0"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <WerviceSearchBar
                onSearch={(location, category) => {
                  console.log('Hero Search:', { location, category });
                  // Handle search logic here
                }}
              />
            </motion.div>

          </motion.div>

          {/* Right Content - Hero Image */}
          <motion.div
            className="relative hidden lg:block"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.0, delay: 0.3 }}
          >
            <motion.div
              className="relative"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-full h-96 rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                  alt="Beautiful Moroccan wedding scene with traditional elements"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end justify-center pb-8">
                  <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.2 }}
                  >
                    <p
                      className="font-ui-primary text-2xl font-semibold tracking-wide text-white"
                    >
                      Your Perfect Day Begins Here
                    </p>
                  </motion.div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                className="absolute -top-8 -right-8 w-20 h-20 rounded-full overflow-hidden shadow-lg border-4 border-white/20 bg-[#2A9D8F]"
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
                  alt="Traditional Moroccan wedding music and entertainment"
                  className="w-full h-full object-cover rounded-full"
                />
              </motion.div>

              <motion.div
                className="absolute -bottom-6 -left-6 w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/30 shadow-lg"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, -3, 3, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
                  alt="Professional wedding photography capturing special moments"
                  className="w-full h-full object-cover rounded-2xl"
                />
              </motion.div>

              <motion.div
                className="absolute top-1/2 -right-12 w-12 h-12 rounded-full overflow-hidden shadow-lg border-2 border-white/40 bg-[#C8102E]"
                animate={{
                  x: [0, 8, 0],
                  y: [0, -5, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                  alt="Professional beauty and makeup services"
                  className="w-full h-full object-cover rounded-full"
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
