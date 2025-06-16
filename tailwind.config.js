module.exports = {
  content: [
    "./pages/*.{js,ts,jsx,tsx}",  // Include your pages
    "./components/**/*.{js,ts,jsx,tsx}", 
    "./*.{js,ts,jsx}" // Include your components
  ],
  purge: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
  darkMode:"class"
}
