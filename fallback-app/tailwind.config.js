/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        emerald: {
          200: '#a5f3fc',
          300: '#67e8f9',
          600: '#0891b2',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        slate: {
          50: '#f8fafc',
          200: '#e2e8f0',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#0a0a12', // hogwarts bg
        },
        hogwarts: {
          bg: 'var(--hogwarts-bg)',
          castle: 'var(--hogwarts-castle)',
          gold: 'rgba(var(--hogwarts-gold-rgb), <alpha-value>)',
          parchment: 'var(--hogwarts-parchment)',
          darkParchment: 'var(--hogwarts-darkParchment)',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
        cinzel: ['Cinzel', 'serif'],
        caveat: ['Caveat', 'cursive'],
      }
    }
  },
  plugins: []
};
