/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      colors: {
        primary:    '#F4A6C5',
        secondary:  '#D4749D',
        highlight:  '#FDE2EC',
        accent:     '#98E46B',
        dark:       '#4A4A4A',
      },
      fontFamily: {
        sans:   ['Inter', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
