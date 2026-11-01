/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        // Space Grotesk carries the wordmark + numbers; Inter does the UI text.
        display: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        iris: {
          50: '#eef0ff',
          100: '#e0e2ff',
          400: '#8b86f5',
          500: '#5b54e8',
          600: '#4a42d4',
          700: '#3d36ad',
        },
      },
      keyframes: {
        'rise-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'rise-in': 'rise-in 0.28s ease-out',
      },
    },
  },
  plugins: [],
}
