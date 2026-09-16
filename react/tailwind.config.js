/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        shop: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#16a34a',
          600: '#15803d',
          700: '#166534',
          900: '#14532d',
        },
        mall: {
          bg: '#f5f5f5',
          ink: '#222222',
          mute: '#757575',
        },
      },
      boxShadow: {
        card: '0 1px 4px rgba(0,0,0,.08)',
        lift: '0 8px 24px rgba(22,163,74,.18)',
      },
    },
  },
  plugins: [],
}
