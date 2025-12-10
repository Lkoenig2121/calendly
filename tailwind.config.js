/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        calendly: {
          blue: '#0069FF',
          'blue-dark': '#0052CC',
          'blue-light': '#E8F2FF',
        },
      },
    },
  },
  safelist: [
    'bg-purple-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-red-500',
    'bg-orange-500',
  ],
  plugins: [],
}

