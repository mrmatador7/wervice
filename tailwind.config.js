/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        wervice: {
          lime: '#D9FF0A',
          ink: '#11190C',
          taupe: '#787664',
          sand: '#CAC4B7',
          shell: '#F3F1EE',
        },
        surface: {
          // neutral surfaces for separation
          base: '#ffffff',
          alt: '#f7f9fb',     // subtle grey-blue
          tint: '#f4fde1',    // wervice lime-tint, very light
        },
        wv: {
          bg: '#F8F8F8',        // page background neutral
          card: '#FFFFFF',      // card background
          text: '#111111',      // primary text
          sub: '#666666',       // secondary text
          line: '#EDEDED',      // borders / dividers
          lime: '#D9FF0A',      // Wervice accent
          limeDark: '#BEE600',  // focus/hover state for accent (slightly darker)
          success: '#16A34A',
          danger: '#DC2626',
          warn: '#F59E0B',
          black: '#11190C',
          gray1: '#F7F7F5',
          gray2: '#EFEDEA',
          gray3: '#DEDBD6',
        },
        'wv-gray1': '#F7F7F5',
        'star-gold': '#FFB800',
        'price-warm': '#FFF8D9',
      },
      boxShadow: {
        card: '0 4px 16px rgba(0,0,0,0.10)',
        soft: '0 2px 10px rgba(0,0,0,0.05)',
        cardHover: '0 12px 28px rgba(17, 25, 12, 0.10)',
        'venue-card': '0 6px 20px rgba(0,0,0,0.08)',
        'venue-card-hover': '0 10px 28px rgba(0,0,0,0.12)',
      },
      backgroundImage: {
        'radial-fade': 'radial-gradient(600px 600px at 50% -50%, rgba(146, 255, 0, .12), transparent 60%)',
      },
      fontFamily: {
        'sans': ['Allan', 'system-ui', 'sans-serif'],
        'rubik': ['Rubik', 'system-ui', 'sans-serif'],
        'readex-pro': ['Readex Pro', 'system-ui', 'sans-serif'],
        'allan': ['Allan', 'system-ui', 'sans-serif'],
        'inter': ['Inter', 'system-ui', 'sans-serif'],
        'poppins': ['Poppins', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        fadeInUp: {
          'from': { opacity: '0', transform: 'translateY(10px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fadeInUp': 'fadeInUp 0.4s ease-out',
      },
      borderRadius: {
        xl: '20px',
        lg: '14px',
        md: '10px',
        '2xl': '20px',
        'venue-card': '20px',
      },
      maxWidth: {
        content: '1200px',
      },
      spacing: {
        // 8px spacing rhythm helpers
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '7': '28px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
      },
    },
  },
  safelist: [
    "pt-[calc(var(--header-h)+32px)]",
    "pt-[calc(var(--header-h)+48px)]"
  ],
  plugins: [],
}
