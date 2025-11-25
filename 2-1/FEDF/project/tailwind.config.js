export default {
  content: [
    "./index.html",
    "./*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        peach: '#fcb69f',
        peachDark: '#ff7e5f',
        peachLight: '#feb47b',
        skyLight: '#a1c4fd',
        skyDark: '#c2e9fb'
      },
      fontFamily: {
        sans: ['Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
