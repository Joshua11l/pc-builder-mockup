/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#7c3aed',
        'primary-soft': '#ede9fe',
        secondary: '#0ea5e9',
        bg: '#0f172a',
        'bg-soft': '#111c30',
        'card-bg': '#111c30',
        'card-elevated': '#152238',
        'text-main': '#f8fafc',
        'text-sub': '#94a3b8',
        'text-dark': '#0f172a',
        accent: '#38bdf8',
        'accent-alt': '#c084fc',
        'border-muted': '#1e293b',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'body-gradient': 'linear-gradient(135deg, #0f172a 0%, #111c30 45%, #1e293b 100%)',
        'card-gradient': 'linear-gradient(180deg, rgba(124, 58, 237, 0.12) 0%, rgba(14, 165, 233, 0.08) 100%)'
      },
      boxShadow: {
        glow: '0 20px 45px -15px rgba(14,165,233,0.45)',
        'inner-glow': 'inset 0 0 0 1px rgba(148,163,184,0.08)',
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
