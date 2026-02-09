/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx,css}',
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#191522',
          surface: '#211C2D',
          elevated: '#2A2438',
        },
        primary: {
          DEFAULT: '#70B966',
          soft: '#8FD089',
          dark: '#4E9B55',
        },
        secondary: {
          DEFAULT: '#6CA6E3',
          soft: '#8FBDF0',
          dark: '#4A82C4',
        },
        accent: {
          DEFAULT: '#E3B86C',
          soft: '#F0CF8F',
          dark: '#C49A4A',
        },
        neutral: {
          100: '#F4F3F6',
          300: '#C7C5CC',
          500: '#9A97A3',
          700: '#5E5B66',
        },
      },
    },
  },
  plugins: [],
}
