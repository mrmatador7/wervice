import '../../../styles/gradients.css';
import AISearchBar from './AISearchBar';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';

const floatingIcons = [
  { src: '/icons/ChatGPT Image Oct 27, 2025, 07_12_48 AM.png', alt: 'Wedding Icon 1', size: 70, top: '15%', left: '8%', delay: '0s', duration: '6s' },
  { src: '/icons/ChatGPT Image Oct 27, 2025, 07_18_06 AM.png', alt: 'Wedding Icon 2', size: 65, top: '20%', right: '10%', delay: '1s', duration: '7s' },
  { src: '/icons/ChatGPT Image Oct 27, 2025, 07_20_58 AM.png', alt: 'Wedding Icon 3', size: 60, top: '45%', left: '5%', delay: '2s', duration: '8s' },
  { src: '/icons/ChatGPT Image Oct 27, 2025, 07_26_59 AM.png', alt: 'Wedding Icon 4', size: 75, top: '50%', right: '7%', delay: '1.5s', duration: '6.5s' },
  { src: '/icons/ChatGPT Image Oct 27, 2025, 07_29_49 AM.png', alt: 'Wedding Icon 5', size: 68, top: '75%', left: '10%', delay: '3s', duration: '7.5s' },
  { src: '/icons/ChatGPT Image Oct 27, 2025, 07_34_16 AM.png', alt: 'Wedding Icon 6', size: 72, top: '70%', right: '12%', delay: '2.5s', duration: '8.5s' },
  { src: '/icons/Oct 27, 2025, 07_23_22 AM.png', alt: 'Wedding Icon 7', size: 64, top: '35%', left: '12%', delay: '4s', duration: '7s' },
];

export default async function Hero({ locale = 'en' }: { locale?: string }) {
  const t = await getTranslations({ locale, namespace: 'home' });

  return (
    <section className="w-full px-4 md:px-6 pt-6 pb-6 z-10">
      <div className="hero-gradient-bg relative w-full rounded-3xl overflow-hidden">
        {/* Mesh Gradient Orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top left - Lime accent */}
        <div 
          className="absolute w-[500px] h-[500px] rounded-full"
          style={{
            top: '-10%',
            left: '-5%',
            background: 'radial-gradient(circle, rgba(217, 255, 10, 0.12) 0%, transparent 70%)',
            filter: 'blur(100px)',
            mixBlendMode: 'multiply',
          }}
        />
        
        {/* Top right - Taupe accent */}
        <div 
          className="absolute w-[450px] h-[450px] rounded-full"
          style={{
            top: '5%',
            right: '-5%',
            background: 'radial-gradient(circle, rgba(120, 118, 100, 0.08) 0%, transparent 70%)',
            filter: 'blur(110px)',
            mixBlendMode: 'multiply',
          }}
        />
        
        {/* Center - Shell accent */}
        <div 
          className="absolute w-[400px] h-[400px] rounded-full"
          style={{
            top: '30%',
            left: '40%',
            background: 'radial-gradient(circle, rgba(243, 241, 238, 0.15) 0%, transparent 70%)',
            filter: 'blur(120px)',
            mixBlendMode: 'multiply',
          }}
        />
        
        {/* Bottom left - Sand accent */}
        <div 
          className="absolute w-[480px] h-[480px] rounded-full"
          style={{
            bottom: '-10%',
            left: '10%',
            background: 'radial-gradient(circle, rgba(202, 196, 183, 0.1) 0%, transparent 70%)',
            filter: 'blur(115px)',
            mixBlendMode: 'multiply',
          }}
        />
        
        {/* Bottom right - Lime accent */}
        <div 
          className="absolute w-[420px] h-[420px] rounded-full"
          style={{
            bottom: '0%',
            right: '5%',
            background: 'radial-gradient(circle, rgba(217, 255, 10, 0.1) 0%, transparent 70%)',
            filter: 'blur(105px)',
            mixBlendMode: 'multiply',
          }}
        />
      </div>

        {/* Floating Wedding Icons */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden hidden lg:block">
          {floatingIcons.map((icon, index) => (
            <div
              key={index}
              className="absolute floating-icon"
              style={{
                top: icon.top,
                left: icon.left,
                right: icon.right,
                animationDelay: icon.delay,
                animationDuration: icon.duration,
              }}
            >
              <Image
                src={icon.src}
                alt={icon.alt}
                width={icon.size}
                height={icon.size}
                className="opacity-40 hover:opacity-60 transition-opacity duration-300"
                style={{
                  filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.1))',
                }}
              />
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="relative z-20 mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-[#11190C] sm:text-4xl md:text-5xl">
              {t('hero.title').split('wedding').map((part, index, array) => (
                <span key={index}>
                  {part}
                  {index < array.length - 1 && (
                    <span className="hero-wedding-gradient">wedding</span>
                  )}
                </span>
              ))}
            </h1>
            <p className="mt-3 text-base text-black/70 sm:text-lg">
              {t('hero.subtitle')}
            </p>
          </div>

          <div className="mt-8 relative">
            <AISearchBar locale={locale} />
          </div>
        </div>
      </div>
    </section>
  );
}
