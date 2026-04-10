/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef3e8',
          100: '#fde4d0',
          200: '#fbc8a1',
          300: '#f8a872',
          400: '#f58d4a',
          500: '#e87c2a',
          600: '#d16b22',
          700: '#b8571c',
          800: '#9e4716',
          900: '#853810',
        },
        coffee: {
          light: '#c7a67f',
          DEFAULT: '#6f4e2e',
          dark: '#3b2a1f',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}