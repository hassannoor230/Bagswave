/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        black: '#0B0A09',
        ivory: '#F7F3ED',
        cream: '#EDE5DA',
        gold: '#B89A67',
        espresso: '#2A211C',
        taupe: '#8A7A6A'
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Manrope', 'Inter', 'system-ui', 'sans-serif']
      },
      letterSpacing: {
        luxury: '0.15em',
        wider: '0.2em'
      }
    }
  },
  plugins: []
};
