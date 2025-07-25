/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb', // Blue-600
          hover: '#1d4ed8', // Blue-700
        },
        secondary: {
          DEFAULT: '#6b7280', // Gray-500
          hover: '#4b5563', // Gray-600
        },
        accent: {
          DEFAULT: '#ffffff',
          hover: '#f9fafb',
        }
      },
      boxShadow: {
        'clean': '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        'clean-lg': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
};