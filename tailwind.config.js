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
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,24,40,.04), 0 8px 24px rgba(16,24,40,.06)',
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
    },
  },
  safelist: [
    "pt-[calc(var(--header-h)+32px)]",
    "pt-[calc(var(--header-h)+48px)]"
  ],
  plugins: [],
}
