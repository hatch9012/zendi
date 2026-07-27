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
          50: '#fdf4f0',
          100: '#fbe3d9',
          200: '#f6c3b0',
          300: '#ee9c7e',
          400: '#e57a55',
          500: '#d85a30',
          600: '#c24a26',
          700: '#a03a20',
          800: '#80301d',
          900: '#682a1b',
        },
      },
      maxWidth: {
        mobile: '430px',
      },
    },
  },
  plugins: [],
};
