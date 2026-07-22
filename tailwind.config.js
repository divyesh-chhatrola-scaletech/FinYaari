/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#25D366',
        dark: '#0A0F1C',
        white: '#FFFFFF',
        background: '#F8FAFC',
        accent: '#1DA851',
        mint: '#7CF5B3',
        emerald: '#0E9F6E',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 4px 40px rgba(0, 0, 0, 0.08)',
        'premium-hover': '0 10px 50px rgba(0, 0, 0, 0.12)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'glow': '0 0 60px rgba(37, 211, 102, 0.35)',
        'phone': '0 40px 120px -20px rgba(10, 15, 28, 0.55), 0 0 0 1px rgba(255,255,255,0.06) inset',
        'float-card': '0 20px 60px -18px rgba(10, 15, 28, 0.28)',
      },
      borderRadius: {
        'xl': '24px',
      },
      backgroundImage: {
        'radial-fade': 'radial-gradient(circle at center, var(--tw-gradient-from), transparent 70%)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(var(--rot, 0deg))' },
          '50%': { transform: 'translateY(-18px) rotate(var(--rot, 0deg))' },
        },
        'float-lg': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-26px)' },
        },
        aurora: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(4%, -6%) scale(1.12)' },
          '66%': { transform: 'translate(-5%, 4%) scale(0.94)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        draw: {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.9)', opacity: '0.6' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
        'ticker-up': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-2px)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'float-lg': 'float-lg 7.5s ease-in-out infinite',
        aurora: 'aurora 18s ease-in-out infinite',
        shimmer: 'shimmer 2.5s linear infinite',
        draw: 'draw 2.2s ease-out forwards',
        'spin-slow': 'spin-slow 22s linear infinite',
        'pulse-ring': 'pulse-ring 2.4s ease-out infinite',
      },
    },
  },
  plugins: [],
}
