module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
    },
    fontFamily: {
      'body': ['Lato', 'sans-serif'],
      'sans': ['Lato', 'sans-serif'],
      'serif': ['Lato', 'sans-serif'],
      'mono': ['Lato', 'sans-serif'],
    }
  },
  variants: {
    extend: {
    },
  },
  plugins: [],
}
