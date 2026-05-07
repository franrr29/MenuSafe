/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'diner-red': '#a33a2c',
        'diner-cream': '#f9f4e8',
        'diner-blue': '#1a3a3a',
      },
      fontFamily: {
        heading: ['"Playfair Display SC"', 'Georgia', 'serif'],
        body: ['Karla', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}