/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4f46e5',
        'primary-light': '#eef2ff',
        secondary: '#6b7280',
        bg: '#131314',
        'card-bg': '#262630',
        'text-main': '#ededf2',
        'text-sub': '#b3b3c2',
        'text-dark': '#111827',
        accent: '#a259ff',
        'accent-alt': '#00ffe7',
        'border-muted': '#42424c',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      backdropBlur: {
        '8': '8px',
      },
      screens: {
        'xs': '475px',
      },
    },
  },
  plugins: [],
}