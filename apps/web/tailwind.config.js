/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'zendi-blue': {
          50: '#eef5fc',
          100: '#d6e6f7',
          200: '#aecdee',
          300: '#7eaee2',
          400: '#4d8bd4',
          500: '#2a6fbf',
          600: '#185fa5',
          700: '#144d86',
          800: '#113f6d',
          900: '#0e3358',
        },
        'zendi-orange': {
          50: '#fff4ed',
          100: '#ffe3d0',
          200: '#ffc4a1',
          300: '#ff9d68',
          400: '#fb7733',
          500: '#f15a0e',
          600: '#e24306',
          700: '#bb3108',
          800: '#94290f',
          900: '#782410',
        },
      },
      maxWidth: {
        mobile: '420px',
      },
    },
  },
  plugins: [],
};
