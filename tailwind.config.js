/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'kuli-red': {
          DEFAULT: '#E41E26',
          light: '#F84B52',
          dark: '#B0181E',
        },
        'kuli-blue': {
          DEFAULT: '#1A365D',
          light: '#2A4365',
          dark: '#0A2346',
        },
        'kuli-gold': {
          DEFAULT: '#C5A059',
          light: '#D4AF87',
          dark: '#A68434',
        },
        'kuli-earth': {
          DEFAULT: '#F4F1EA',
          dark: '#E2E0D8',
          light: '#FDFCF9',
        },
        'kuli-dark': '#2D3748',
        'kuli-station': '#F1F5F9', // Light gray for station surfaces
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        accent: ['Outfit', 'Montserrat', 'sans-serif'],
      },
      boxShadow: {
        'kuli': '0 4px 20px -2px rgba(0, 0, 0, 0.08), 0 2px 8px -2px rgba(0, 0, 0, 0.04)',
        'kuli-hover': '0 10px 30px -4px rgba(0, 0, 0, 0.1), 0 4px 12px -4px rgba(0, 0, 0, 0.06)',
      },
      borderRadius: {
        'kuli': '1rem',
      },
      keyframes: {
        'ping-slow': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '70%, 100%': { transform: 'scale(2)', opacity: '0' },
        },
        'scan': {
          '0%': { top: '0%' },
          '100%': { top: '100%' },
        }
      },
      animation: {
        'ping-slow': 'ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite',
        'scan': 'scan 8s linear infinite',
      }
    },
  },
  plugins: [],
}
