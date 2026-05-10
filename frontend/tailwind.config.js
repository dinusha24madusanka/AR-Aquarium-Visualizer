/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          900: '#031424',
          800: '#0B2B4A',
          700: '#144170',
          500: '#2A75C3',
          300: '#6BA5E5',
          100: '#C2E0FF',
        },
        neon: {
          teal: '#00F0FF',
          blue: '#0066FF',
        }
      },
      backgroundImage: {
        'ocean-gradient': 'linear-gradient(to bottom, #031424, #0B2B4A)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'neon': '0 0 15px rgba(0, 240, 255, 0.5)',
      }
    },
  },
  plugins: [],
}
