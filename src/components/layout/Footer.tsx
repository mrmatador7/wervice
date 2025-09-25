import { useTranslations } from 'next-intl';
import { FOOTER_LINKS, CURRENT_YEAR } from '@/lib/constants';

export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="bg-black text-white py-12">
      <div className="container mx-auto px-4 text-center">
        <div className="mb-8">
          <h3 className="text-2xl font-serif font-bold text-lime-400 mb-2">{t('title')}</h3>
          <p className="text-white/80 mb-6">
            {t('subtitle')}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8 mb-8">
          {FOOTER_LINKS.map((link, index) => (
            <a key={index} href={link.href} className="text-lime-400 hover:text-white transition-colors">
              {t(`links.${link.key}`)}
            </a>
          ))}
        </div>

        <div className="flex justify-center space-x-6 mb-6">
          <a href="#" className="w-10 h-10 bg-lime-400 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors">
            📘
          </a>
          <a href="#" className="w-10 h-10 bg-lime-400 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors">
            📷
          </a>
          <a href="#" className="w-10 h-10 bg-lime-400 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors">
            🐦
          </a>
          <a href="#" className="w-10 h-10 bg-lime-400 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors">
            💼
          </a>
        </div>

        <div className="border-t border-lime-400/20 pt-6">
          <p className="text-white/60 text-sm mb-2">
            &copy; {CURRENT_YEAR} Wervice. {t('copyright')}
          </p>
          <p className="text-white/40 text-xs">
            {t('description')}
          </p>
        </div>
      </div>
    </footer>
  );
}
