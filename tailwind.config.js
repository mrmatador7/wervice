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
          lime: '#D9FF0A',
          limeDark: '#C8EF00',
          black: '#11190C',
          gray1: '#F7F7F5',
          gray2: '#EFEDEA',
          gray3: '#DEDBD6',
        },
        'wv-gray1': '#F7F7F5',
      },
      boxShadow: {
        card: '0 8px 24px rgba(17, 25, 12, 0.06)',
        cardHover: '0 12px 28px rgba(17, 25, 12, 0.10)',
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
        xl: '16px',
        '2xl': '20px',
      },
      maxWidth: {
        content: '1200px',
      },
    },
  },
  safelist: [
    "pt-[calc(var(--header-h)+32px)]",
    "pt-[calc(var(--header-h)+48px)]"
  ],
  plugins: [],
}
