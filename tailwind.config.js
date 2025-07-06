/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'neutral-light': '#f5f5f5',
        'neutral-dark': '#22223b',
        'primary': '#2563eb',
        'secondary': '#64748b',
        'fitness-green': '#32cd32',
        'fitness-blue': '#1e90ff',
        'fitness-orange': '#ff8c00',
        'fitness-pink': '#ff4f81',
        'fitness-dark': '#18181b',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(90deg, #1e90ff 0%, #32cd32 50%, #ff8c00 100%)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        'pulse-heart': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 1s ease-in',
        'pulse-heart': 'pulse-heart 1s infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

