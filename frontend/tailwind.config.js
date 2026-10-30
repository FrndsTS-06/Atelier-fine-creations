/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: '#0C0B09',
          subtle: '#141310',
          card: '#191814',
          hover: '#22201B',
          border: '#2C2720',
        },
        espresso: {
          DEFAULT: '#352318',
          dark: '#22160F',
          light: '#4A3324',
        },
        champagne: {
          DEFAULT: '#C49A5A',
          light: '#DEC08E',
          dark: '#A87E40',
        },
        ivory: {
          DEFAULT: '#F5F0E7',
          muted: '#D5CCC0',
          dim: '#A89E90',
        },
        'warm-beige': {
          DEFAULT: '#D8C4A8',
          muted: '#B8A58D',
        },
        'body-text': '#37312B',
      },
      fontFamily: {
        heading: ['Cormorant Garamond', 'Playfair Display', 'serif'],
        display: ['Playfair Display', 'Cormorant Garamond', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        gold: '0 8px 30px rgba(196, 154, 90, 0.16)',
        'gold-hover': '0 14px 40px rgba(196, 154, 90, 0.28)',
      },
    },
  },
  plugins: [],
};
