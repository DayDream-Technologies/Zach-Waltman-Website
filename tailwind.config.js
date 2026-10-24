/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#F6F4F0',
        evergreen: {
          50: '#f2f7f5',
          100: '#e0ebe6',
          200: '#c1d6cd',
          300: '#97b8aa',
          400: '#679482',
          500: '#457564',
          600: '#345d4f',
          700: '#2b4c41',
          800: '#17453B',
          900: '#12352d',
          950: '#0a1f1a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 18px 50px -24px rgba(23, 69, 59, 0.35)',
      },
      maxWidth: {
        content: '72rem',
      },
    },
  },
  plugins: [],
};
